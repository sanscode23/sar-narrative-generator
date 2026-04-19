import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import AuditTrail from '../components/AuditTrail';
import './Workspace.css';

function Workspace() {
  const { id } = useParams();
  const [caseData, setCaseData] = useState(null);
  const [sar, setSar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [narrativeText, setNarrativeText] = useState('');
  const [activeTab, setActiveTab] = useState('narrative'); // narrative or audit

  const fetchData = async () => {
    try {
      const [caseRes, sarRes] = await Promise.all([
        api.get(`/cases/${id}`),
        api.get(`/sars/case/${id}`).catch(() => ({ data: null }))
      ]);
      setCaseData(caseRes.data);
      if (sarRes.data) {
        setSar(sarRes.data);
        setNarrativeText(sarRes.data.narrative);
      }
    } catch (error) {
      console.error('Error fetching workspace data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await api.post('/sars/generate', { caseId: id });
      setSar(res.data);
      setNarrativeText(res.data.narrative);
      // refetch case to update status
      const caseRes = await api.get(`/cases/${id}`);
      setCaseData(caseRes.data);
    } catch (error) {
      alert('Error generating narrative');
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!sar) return;
    try {
      const res = await api.put(`/sars/${sar._id}`, { narrative: narrativeText });
      setSar(res.data);
      alert('SAR Draft Saved');
    } catch (error) {
      alert('Error saving SAR');
    }
  };

  if (loading) return <div className="loader">Loading Workspace...</div>;
  if (!caseData) return <div>Case not found</div>;

  return (
    <div className="workspace animate-fade-in">
      <div className="workspace-header">
        <div>
          <span className="case-number">{caseData.caseNumber}</span>
          <h1 className="page-title">{caseData.title}</h1>
        </div>
        <div className="workspace-actions">
          <button 
            className={`btn ${activeTab === 'narrative' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('narrative')}
          >
            Narrative Editor
          </button>
          <button 
            className={`btn ${activeTab === 'audit' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('audit')}
          >
            View Audit Trail
          </button>
        </div>
      </div>

      <div className="workspace-grid">
        {/* Left Pane: Case Information */}
        <div className="case-details-pane glass-panel">
          <h3>Case Data</h3>
          
          <div className="detail-section">
            <h4>Description</h4>
            <p>{caseData.description}</p>
          </div>

          <div className="detail-section">
            <h4>Entities Involved</h4>
            <ul className="entity-list">
              {caseData.entitiesInvolved.map((ent, idx) => (
                <li key={idx}>
                  <strong>{ent.name}</strong> ({ent.role})<br/>
                  <small>Acct: {ent.accountNumber}</small>
                </li>
              ))}
            </ul>
          </div>

          <div className="detail-section">
            <h4>Transactions</h4>
            <table className="tx-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {caseData.transactions.map((tx, idx) => (
                  <tr key={idx}>
                    <td>{new Date(tx.date).toLocaleDateString()}</td>
                    <td>{tx.transactionType}</td>
                    <td className="amount">${tx.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Pane: Editor or Audit */}
        <div className="action-pane glass-panel">
          {activeTab === 'narrative' ? (
            <div className="narrative-editor">
              <div className="editor-header">
                <h3>Draft SAR Narrative</h3>
                <div>
                  {!sar ? (
                     <button className="btn btn-primary" onClick={handleGenerate} disabled={generating}>
                       {generating ? 'Generating AI Draft...' : '✨ Generate AI Draft'}
                     </button>
                  ) : (
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button className="btn btn-secondary" onClick={handleGenerate} disabled={generating}>
                        Regenerate
                      </button>
                      <button className="btn btn-primary" onClick={handleSave}>
                        💾 Save Draft
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="editor-body">
                {sar ? (
                  <textarea 
                    className="document-editor"
                    value={narrativeText}
                    onChange={(e) => setNarrativeText(e.target.value)}
                  />
                ) : (
                  <div className="empty-editor">
                    <span className="icon">📄</span>
                    <p>No narrative exists for this case.</p>
                    <p className="sub">Click 'Generate AI Draft' to create a regulator-ready SAR draft based on the case data.</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <AuditTrail caseId={caseData._id} sarId={sar?._id} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Workspace;
