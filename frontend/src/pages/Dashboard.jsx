import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './Dashboard.css';

function Dashboard() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const res = await api.get('/cases');
        setCases(res.data);
      } catch (error) {
        console.error('Error fetching cases', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCases();
  }, []);

  const createMockCase = async () => {
    try {
      const mockCase = {
        caseNumber: `CAS-${Math.floor(Math.random() * 10000)}`,
        title: 'Suspicious Wire Transfers',
        description: 'Customer initiated multiple high-value wire transfers to offshore accounts immediately following large cash deposits.',
        entitiesInvolved: [
          { name: 'John Doe', role: 'Primary Subject', accountNumber: '123456789' }
        ],
        transactions: [
          { date: new Date(), amount: 9500, transactionType: 'Cash Deposit', description: 'Branch Deposit' },
          { date: new Date(), amount: 9000, transactionType: 'Wire Out', description: 'Offshore Transfer' }
        ]
      };
      const res = await api.post('/cases', mockCase);
      setCases([res.data, ...cases]);
    } catch (error) {
      alert('Error creating case');
    }
  };

  if (loading) return <div className="loader">Loading workspace...</div>;

  return (
    <div className="dashboard animate-fade-in">
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Investigations Overview</h1>
          <p className="page-subtitle">Manage cases and generate narratives.</p>
        </div>
        <button className="btn btn-primary" onClick={createMockCase}>+ New Mock Case</button>
      </div>

      <div className="cases-grid">
        {cases.map(c => (
          <Link to={`/case/${c._id}`} key={c._id} className="case-card glass-panel">
            <div className="case-card-header">
              <span className="case-number">{c.caseNumber}</span>
              <span className={`badge badge-${c.status.toLowerCase().replace(' ', '-')}`}>
                {c.status}
              </span>
            </div>
            <h3 className="case-title">{c.title}</h3>
            <p className="case-desc">{c.description.substring(0, 100)}...</p>
            <div className="case-footer">
              <span>{new Date(c.createdAt).toLocaleDateString()}</span>
              <span className="view-link">Open Workspace &rarr;</span>
            </div>
          </Link>
        ))}
        {cases.length === 0 && (
          <div className="empty-state">
            <p>No cases found. Create a mock case to begin.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
