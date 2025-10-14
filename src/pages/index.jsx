import Layout from "./Layout.jsx";

import Dashboard from "./Dashboard";

import Contracts from "./Contracts";

import TokenAnalytics from "./TokenAnalytics";

import Markets from "./Markets";

import Oracles from "./Oracles";

import AuditLogs from "./AuditLogs";

import Alerts from "./Alerts";

import Compliance from "./Compliance";

import SecurityPosture from "./SecurityPosture";

import Policies from "./Policies";

import RiskManagement from "./RiskManagement";

import DataGovernance from "./DataGovernance";

import AIGovernance from "./AIGovernance";

import NeuralIntelligence from "./NeuralIntelligence";

import AutomationEngine from "./AutomationEngine";

import ExplainabilityCenter from "./ExplainabilityCenter";

import DeviationMonitor from "./DeviationMonitor";

import AIActionsLog from "./AIActionsLog";

import AccessControl from "./AccessControl";

import TrustLayer from "./TrustLayer";

import TrustBoundaries from "./TrustBoundaries";

import TemporalReasoning from "./TemporalReasoning";

import TreasuryOps from "./TreasuryOps";

import ScenarioSimulator from "./ScenarioSimulator";

import FeedbackLoop from "./FeedbackLoop";

import Certify from "./Certify";

import PredictionRiskMap from "./PredictionRiskMap";

import Schedulers from "./Schedulers";

import SystemStatus from "./SystemStatus";

import DataVault from "./DataVault";

import IdentityGraph from "./IdentityGraph";

import Exports from "./Exports";

import AgentControls from "./AgentControls";

import Forensics from "./Forensics";

import TrainingDataLab from "./TrainingDataLab";

import MetricsDesign from "./MetricsDesign";

import EmergencyActions from "./EmergencyActions";

import DecisionHistory from "./DecisionHistory";

import QuorumGovernance from "./QuorumGovernance";

import ComponentStore from "./ComponentStore";

import NeuralPolicyComposer from "./NeuralPolicyComposer";

import TrustTruthEngine from "./TrustTruthEngine";

import ConstitutionalGuard from "./ConstitutionalGuard";

import UserSettings from "./UserSettings";

import Notifications from "./Notifications";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Dashboard: Dashboard,
    
    Contracts: Contracts,
    
    TokenAnalytics: TokenAnalytics,
    
    Markets: Markets,
    
    Oracles: Oracles,
    
    AuditLogs: AuditLogs,
    
    Alerts: Alerts,
    
    Compliance: Compliance,
    
    SecurityPosture: SecurityPosture,
    
    Policies: Policies,
    
    RiskManagement: RiskManagement,
    
    DataGovernance: DataGovernance,
    
    AIGovernance: AIGovernance,
    
    NeuralIntelligence: NeuralIntelligence,
    
    AutomationEngine: AutomationEngine,
    
    ExplainabilityCenter: ExplainabilityCenter,
    
    DeviationMonitor: DeviationMonitor,
    
    AIActionsLog: AIActionsLog,
    
    AccessControl: AccessControl,
    
    TrustLayer: TrustLayer,
    
    TrustBoundaries: TrustBoundaries,
    
    TemporalReasoning: TemporalReasoning,
    
    TreasuryOps: TreasuryOps,
    
    ScenarioSimulator: ScenarioSimulator,
    
    FeedbackLoop: FeedbackLoop,
    
    Certify: Certify,
    
    PredictionRiskMap: PredictionRiskMap,
    
    Schedulers: Schedulers,
    
    SystemStatus: SystemStatus,
    
    DataVault: DataVault,
    
    IdentityGraph: IdentityGraph,
    
    Exports: Exports,
    
    AgentControls: AgentControls,
    
    Forensics: Forensics,
    
    TrainingDataLab: TrainingDataLab,
    
    MetricsDesign: MetricsDesign,
    
    EmergencyActions: EmergencyActions,
    
    DecisionHistory: DecisionHistory,
    
    QuorumGovernance: QuorumGovernance,
    
    ComponentStore: ComponentStore,
    
    NeuralPolicyComposer: NeuralPolicyComposer,
    
    TrustTruthEngine: TrustTruthEngine,
    
    ConstitutionalGuard: ConstitutionalGuard,
    
    UserSettings: UserSettings,
    
    Notifications: Notifications,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Dashboard />} />
                
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/Contracts" element={<Contracts />} />
                
                <Route path="/TokenAnalytics" element={<TokenAnalytics />} />
                
                <Route path="/Markets" element={<Markets />} />
                
                <Route path="/Oracles" element={<Oracles />} />
                
                <Route path="/AuditLogs" element={<AuditLogs />} />
                
                <Route path="/Alerts" element={<Alerts />} />
                
                <Route path="/Compliance" element={<Compliance />} />
                
                <Route path="/SecurityPosture" element={<SecurityPosture />} />
                
                <Route path="/Policies" element={<Policies />} />
                
                <Route path="/RiskManagement" element={<RiskManagement />} />
                
                <Route path="/DataGovernance" element={<DataGovernance />} />
                
                <Route path="/AIGovernance" element={<AIGovernance />} />
                
                <Route path="/NeuralIntelligence" element={<NeuralIntelligence />} />
                
                <Route path="/AutomationEngine" element={<AutomationEngine />} />
                
                <Route path="/ExplainabilityCenter" element={<ExplainabilityCenter />} />
                
                <Route path="/DeviationMonitor" element={<DeviationMonitor />} />
                
                <Route path="/AIActionsLog" element={<AIActionsLog />} />
                
                <Route path="/AccessControl" element={<AccessControl />} />
                
                <Route path="/TrustLayer" element={<TrustLayer />} />
                
                <Route path="/TrustBoundaries" element={<TrustBoundaries />} />
                
                <Route path="/TemporalReasoning" element={<TemporalReasoning />} />
                
                <Route path="/TreasuryOps" element={<TreasuryOps />} />
                
                <Route path="/ScenarioSimulator" element={<ScenarioSimulator />} />
                
                <Route path="/FeedbackLoop" element={<FeedbackLoop />} />
                
                <Route path="/Certify" element={<Certify />} />
                
                <Route path="/PredictionRiskMap" element={<PredictionRiskMap />} />
                
                <Route path="/Schedulers" element={<Schedulers />} />
                
                <Route path="/SystemStatus" element={<SystemStatus />} />
                
                <Route path="/DataVault" element={<DataVault />} />
                
                <Route path="/IdentityGraph" element={<IdentityGraph />} />
                
                <Route path="/Exports" element={<Exports />} />
                
                <Route path="/AgentControls" element={<AgentControls />} />
                
                <Route path="/Forensics" element={<Forensics />} />
                
                <Route path="/TrainingDataLab" element={<TrainingDataLab />} />
                
                <Route path="/MetricsDesign" element={<MetricsDesign />} />
                
                <Route path="/EmergencyActions" element={<EmergencyActions />} />
                
                <Route path="/DecisionHistory" element={<DecisionHistory />} />
                
                <Route path="/QuorumGovernance" element={<QuorumGovernance />} />
                
                <Route path="/ComponentStore" element={<ComponentStore />} />
                
                <Route path="/NeuralPolicyComposer" element={<NeuralPolicyComposer />} />
                
                <Route path="/TrustTruthEngine" element={<TrustTruthEngine />} />
                
                <Route path="/ConstitutionalGuard" element={<ConstitutionalGuard />} />
                
                <Route path="/UserSettings" element={<UserSettings />} />
                
                <Route path="/Notifications" element={<Notifications />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}