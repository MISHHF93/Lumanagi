import { createElement, useMemo } from 'react'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom'
import Layout from './Layout.jsx'
import Dashboard from './Dashboard'
import Contracts from './Contracts'
import TokenAnalytics from './TokenAnalytics'
import Markets from './Markets'
import Oracles from './Oracles'
import AuditLogs from './AuditLogs'
import Alerts from './Alerts'
import Compliance from './Compliance'
import SecurityPosture from './SecurityPosture'
import Policies from './Policies'
import RiskManagement from './RiskManagement'
import DataGovernance from './DataGovernance'
import AIGovernance from './AIGovernance'
import NeuralIntelligence from './NeuralIntelligence'
import AutomationEngine from './AutomationEngine'
import ExplainabilityCenter from './ExplainabilityCenter'
import DeviationMonitor from './DeviationMonitor'
import AIActionsLog from './AIActionsLog'
import AccessControl from './AccessControl'
import TrustLayer from './TrustLayer'
import TrustBoundaries from './TrustBoundaries'
import TemporalReasoning from './TemporalReasoning'
import TreasuryOps from './TreasuryOps'
import ScenarioSimulator from './ScenarioSimulator'
import FeedbackLoop from './FeedbackLoop'
import Certify from './Certify'
import PredictionRiskMap from './PredictionRiskMap'
import Schedulers from './Schedulers'
import SystemStatus from './SystemStatus'
import DataVault from './DataVault'
import IdentityGraph from './IdentityGraph'
import Exports from './Exports'
import AgentControls from './AgentControls'
import Forensics from './Forensics'
import TrainingDataLab from './TrainingDataLab'
import MetricsDesign from './MetricsDesign'
import EmergencyActions from './EmergencyActions'
import DecisionHistory from './DecisionHistory'
import QuorumGovernance from './QuorumGovernance'
import ComponentStore from './ComponentStore'
import NeuralPolicyComposer from './NeuralPolicyComposer'
import TrustTruthEngine from './TrustTruthEngine'
import ConstitutionalGuard from './ConstitutionalGuard'
import UserSettings from './UserSettings'
import Notifications from './Notifications'

const PAGE_COMPONENTS = {
  Dashboard,
  Contracts,
  TokenAnalytics,
  Markets,
  Oracles,
  AuditLogs,
  Alerts,
  Compliance,
  SecurityPosture,
  Policies,
  RiskManagement,
  DataGovernance,
  AIGovernance,
  NeuralIntelligence,
  AutomationEngine,
  ExplainabilityCenter,
  DeviationMonitor,
  AIActionsLog,
  AccessControl,
  TrustLayer,
  TrustBoundaries,
  TemporalReasoning,
  TreasuryOps,
  ScenarioSimulator,
  FeedbackLoop,
  Certify,
  PredictionRiskMap,
  Schedulers,
  SystemStatus,
  DataVault,
  IdentityGraph,
  Exports,
  AgentControls,
  Forensics,
  TrainingDataLab,
  MetricsDesign,
  EmergencyActions,
  DecisionHistory,
  QuorumGovernance,
  ComponentStore,
  NeuralPolicyComposer,
  TrustTruthEngine,
  ConstitutionalGuard,
  UserSettings,
  Notifications
}

const ROUTES = [
  { path: '/', element: <Dashboard /> },
  ...Object.keys(PAGE_COMPONENTS).map((name) => ({
    path: `/${name}`,
    element: createElement(PAGE_COMPONENTS[name])
  }))
]

function getCurrentPageName(pathname) {
  if (!pathname || pathname === '/') {
    return 'Dashboard'
  }

  const sanitized = pathname.replace(/\/$/, '')
  const lastSegment = sanitized.split('/').pop() || 'Dashboard'
  const match = Object.keys(PAGE_COMPONENTS).find(
    (key) => key.toLowerCase() === lastSegment.toLowerCase()
  )
  return match || 'Dashboard'
}

function PagesContent() {
  const location = useLocation()
  const currentPage = useMemo(
    () => getCurrentPageName(location.pathname),
    [location.pathname]
  )

  return (
    <Layout currentPageName={currentPage}>
      <Routes>
        {ROUTES.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Routes>
    </Layout>
  )
}

export default function Pages() {
  return (
    <Router>
      <PagesContent />
    </Router>
  )
}
