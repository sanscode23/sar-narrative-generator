import { useState, useEffect } from 'react';
import api from '../services/api';
import './AuditTrail.css';

function AuditTrail({ caseId, sarId }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        // Fetch logs for both case and SAR and merge them
        const [caseLogs, sarLogs] = await Promise.all([
          api.get(`/audit/${caseId}`),
          sarId ? api.get(`/audit/${sarId}`) : Promise.resolve({ data: [] })
        ]);
        
        const mergedLogs = [...caseLogs.data, ...sarLogs.data].sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        
        setLogs(mergedLogs);
      } catch (error) {
        console.error('Error fetching audit logs', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [caseId, sarId]);

  if (loading) return <div className="p-4">Loading audit trail...</div>;

  return (
    <div className="audit-trail-container">
      <h3>Immutable Audit Trail</h3>
      <p className="trail-subtitle">System ensures full regulator-ready transparency.</p>
      
      <div className="timeline">
        {logs.map((log) => (
          <div key={log._id} className="timeline-item animate-fade-in">
            <div className="timeline-marker"></div>
            <div className="timeline-content">
              <div className="timeline-header">
                <strong>{log.action}</strong>
                <span className="timestamp">{new Date(log.createdAt).toLocaleString()}</span>
              </div>
              <div className="timeline-body">
                <p>Performed by: <span className="user-badge">{log.performedBy?.username || 'System'}</span></p>
                {log.details && Object.keys(log.details).length > 0 && (
                  <pre className="details-dump">
                    {JSON.stringify(log.details, null, 2)}
                  </pre>
                )}
              </div>
            </div>
          </div>
        ))}
        {logs.length === 0 && <p className="text-secondary">No audit logs found.</p>}
      </div>
    </div>
  );
}

export default AuditTrail;
