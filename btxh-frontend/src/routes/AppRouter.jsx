import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROLES } from '../utils/constants';

// Layouts
import GuestLayout   from '../components/layout/GuestLayout';
import UserLayout    from '../components/layout/UserLayout';
import AdminLayout   from '../components/layout/AdminLayout';
import NotFound      from '../components/common/NotFound';

// ─── Guest ────────────────────────────────────────────
import HomePage      from '../pages/guest/HomePage';
import GuidePage     from '../pages/guest/GuidePage';
import LoginPage     from '../pages/guest/LoginPage';
import RegisterPage  from '../pages/guest/RegisterPage';

// ─── Sender ───────────────────────────────────────────
import SenderDashboard    from '../pages/sender/SenderDashboard';
import CreateChildRequest from '../pages/sender/CreateChildRequest';
import UpdateChildRequest from '../pages/sender/UpdateChildRequest';
import RequestStatus      from '../pages/sender/RequestStatus';
import SentChildInfo      from '../pages/sender/SentChildInfo';
import SenderProfile      from '../pages/sender/SenderProfile';

// ─── Adopter ──────────────────────────────────────────
import AdopterDashboard        from '../pages/adopter/AdopterDashboard';
import ChildrenList            from '../pages/adopter/ChildrenList';
import ChildDetail             from '../pages/adopter/ChildDetail';
import CreateAdoptionRequest   from '../pages/adopter/CreateAdoptionRequest';
import UpdateAdoptionRequest   from '../pages/adopter/UpdateAdoptionRequest';
import AdoptionStatus          from '../pages/adopter/AdoptionStatus';
import AdopterProfile          from '../pages/adopter/AdopterProfile';

// ─── Staff Reception ──────────────────────────────────
// CapNhatHoSo đã gộp vào ChildForm
import Dashboard               from '../pages/staff-reception/Dashboard';
import ReceptionDashboard      from '../pages/staff-reception/ReceptionDashboard';
import ChildRequestList        from '../pages/staff-reception/ChildRequestList';
import ChildRequestDetail      from '../pages/staff-reception/ChildRequestDetail';
import CreateReceptionProfile  from '../pages/staff-reception/CreateReceptionProfile';
import ChildList               from '../pages/staff-reception/ChildList';
import ChildForm               from '../pages/staff-reception/ChildForm';
import ChildHealthList         from '../pages/staff-reception/ChildHealthList';
import ChildHealthForm         from '../pages/staff-reception/ChildHealthForm';

// ─── Staff Adoption ───────────────────────────────────
import AdoptionDashboard       from '../pages/staff-adoption/AdoptionDashboard';
import AdoptionRequestList     from '../pages/staff-adoption/AdoptionRequestList';
import AdoptionRequestDetail   from '../pages/staff-adoption/AdoptionRequestDetail';
import CreateAdoptionProfile   from '../pages/staff-adoption/CreateAdoptionProfile';
import AdoptionChildList       from '../pages/staff-adoption/AdoptionChildList';
import AdoptionChildDetail     from '../pages/staff-adoption/AdoptionChildDetail';

// ─── Manager ──────────────────────────────────────────
import ManagerDashboard    from '../pages/manager/ManagerDashboard';
import PendingProfileList  from '../pages/manager/PendingProfileList';
import ProfileApproval     from '../pages/manager/ProfileApproval';
import Statistics          from '../pages/manager/Statistics';

// ─── Admin ────────────────────────────────────────────
import DashboardAdmin      from '../pages/admin/DashboardAdmin';
import AccountList         from '../pages/admin/AccountList';
import AccountForm         from '../pages/admin/AccountForm';
import RoleManagement      from '../pages/admin/RoleManagement';

// ─── Route guard ──────────────────────────────────────
function ProtectedRoute({ allowedRoles, children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/dang-nhap" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role))
    return <Navigate to="/dang-nhap" replace />;
  return children;
}

function Guard({ roles, layout: Layout }) {
  return (
    <ProtectedRoute allowedRoles={roles}>
      <Layout />
    </ProtectedRoute>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Redirect root → preview ──────────────── */}
        <Route path="/" element={<Navigate to="/preview" replace />} />

        {/* ── Public ─────────────────────────────────── */}
        <Route element={<GuestLayout />}>
          <Route path="/huong-dan" element={<GuidePage />} />
          <Route path="/dang-nhap" element={<LoginPage />} />
          <Route path="/dang-ky"   element={<RegisterPage />} />
        </Route>

        {/* ── Sender /gui-tre/* ───────────────────────── */}
        <Route element={<Guard roles={[ROLES.SENDER]} layout={UserLayout} />}>
          <Route path="/gui-tre/dashboard"       element={<SenderDashboard />} />
          <Route path="/gui-tre/tao-yeu-cau"     element={<CreateChildRequest />} />
          <Route path="/gui-tre/cap-nhat/:id"    element={<UpdateChildRequest />} />
          <Route path="/gui-tre/trang-thai"      element={<RequestStatus />} />
          <Route path="/gui-tre/tre/:id"         element={<SentChildInfo />} />
          <Route path="/gui-tre/ho-so"           element={<SenderProfile />} />
        </Route>

        {/* ── Adopter /nhan-nuoi/* ────────────────────── */}
        <Route element={<Guard roles={[ROLES.ADOPTER]} layout={UserLayout} />}>
          <Route path="/nhan-nuoi/dashboard"      element={<AdopterDashboard />} />
          <Route path="/nhan-nuoi/danh-sach-tre"  element={<ChildrenList />} />
          <Route path="/nhan-nuoi/tre/:id"        element={<ChildDetail />} />
          <Route path="/nhan-nuoi/tao-don"        element={<CreateAdoptionRequest />} />
          <Route path="/nhan-nuoi/cap-nhat/:id"   element={<UpdateAdoptionRequest />} />
          <Route path="/nhan-nuoi/trang-thai"     element={<AdoptionStatus />} />
          <Route path="/nhan-nuoi/ho-so"          element={<AdopterProfile />} />
        </Route>

        {/* ── Staff Reception /can-bo-tiep-nhan/* ─────── */}
        <Route element={<Guard roles={[ROLES.STAFF_RECEPTION]} layout={UserLayout} />}>
          <Route path="/cap-nhat-ho-so" element={<Navigate to="/can-bo-tiep-nhan/tre/tao" replace />} />
          <Route path="/can-bo-tiep-nhan/dashboard"                       element={<ReceptionDashboard />} />
          <Route path="/can-bo-tiep-nhan/yeu-cau"                         element={<ChildRequestList />} />
          <Route path="/can-bo-tiep-nhan/yeu-cau/:id"                     element={<ChildRequestDetail />} />
          <Route path="/can-bo-tiep-nhan/tao-ho-so/:requestId"            element={<CreateReceptionProfile />} />
          <Route path="/can-bo-tiep-nhan/tre"                             element={<ChildList />} />
          <Route path="/can-bo-tiep-nhan/tre/tao"                         element={<ChildForm />} />
          <Route path="/can-bo-tiep-nhan/tre/:id/sua"                     element={<ChildForm />} />
          <Route path="/can-bo-tiep-nhan/tre/:childId/suc-khoe"           element={<ChildHealthList />} />
          <Route path="/can-bo-tiep-nhan/tre/:childId/suc-khoe/tao"       element={<ChildHealthForm />} />
          <Route path="/can-bo-tiep-nhan/tre/:childId/suc-khoe/:id/sua"   element={<ChildHealthForm />} />
        </Route>

        {/* ── Staff Adoption /can-bo-nhan-nuoi/* ─────── */}
        <Route element={<Guard roles={[ROLES.STAFF_ADOPTION]} layout={UserLayout} />}>
          <Route path="/can-bo-nhan-nuoi/dashboard"          element={<AdoptionDashboard />} />
          <Route path="/can-bo-nhan-nuoi/danh-sach"          element={<AdoptionRequestList />} />
          <Route path="/can-bo-nhan-nuoi/chi-tiet/:id"       element={<AdoptionRequestDetail />} />
          <Route path="/can-bo-nhan-nuoi/tao-ho-so/:requestId" element={<CreateAdoptionProfile />} />
          <Route path="/can-bo-nhan-nuoi/tre"                element={<AdoptionChildList />} />
          <Route path="/can-bo-nhan-nuoi/tre/:id"            element={<AdoptionChildDetail />} />
        </Route>

        {/* ── Manager /truong-phong/* ─────────────────── */}
        <Route element={<Guard roles={[ROLES.MANAGER]} layout={UserLayout} />}>
          <Route path="/truong-phong/dashboard"             element={<ManagerDashboard />} />
          <Route path="/truong-phong/cho-duyet"             element={<PendingProfileList />} />
          <Route path="/truong-phong/duyet/:type/:id"       element={<ProfileApproval />} />
          <Route path="/truong-phong/thong-ke"              element={<Statistics />} />
        </Route>

        {/* ── Admin /admin/* ──────────────────────────── */}
        <Route element={<Guard roles={[ROLES.ADMIN]} layout={AdminLayout} />}>
          <Route path="/admin/dashboard"       element={<DashboardAdmin />} />
          <Route path="/admin/accounts"        element={<AccountList />} />
          <Route path="/admin/accounts/new"    element={<AccountForm />} />
          <Route path="/admin/accounts/:id/edit" element={<AccountForm />} />
          <Route path="/admin/roles"           element={<RoleManagement />} />
        </Route>

        {/* ── Preview (không cần login) — layout Dashboard + Outlet ── */}
        <Route element={<Dashboard />}>
          <Route path="/preview"                                    element={<ReceptionDashboard />} />
          <Route path="/preview/dashboard"                          element={<ReceptionDashboard />} />
          <Route path="/preview/yeu-cau"                            element={<ChildRequestList />} />
          <Route path="/preview/yeu-cau/:id"                        element={<ChildRequestDetail />} />
          <Route path="/preview/chi-tiet"                           element={<ChildRequestDetail />} />
          <Route path="/preview/tao-ho-so/:requestId"               element={<CreateReceptionProfile />} />
          <Route path="/preview/tiep-nhan"                          element={<CreateReceptionProfile />} />
          <Route path="/preview/danh-sach-tre"                      element={<ChildList />} />
          <Route path="/preview/tre"                                element={<ChildList />} />
          <Route path="/preview/tre/tao"                            element={<ChildForm />} />
          <Route path="/preview/tre/:id/sua"                        element={<ChildForm />} />
          <Route path="/preview/ho-so"                              element={<ChildForm />} />
          <Route path="/preview/tre/:childId/suc-khoe"              element={<ChildHealthList />} />
          <Route path="/preview/suc-khoe"                           element={<ChildHealthList />} />
          <Route path="/preview/tre/:childId/suc-khoe/tao"          element={<ChildHealthForm />} />
          <Route path="/preview/tre/:childId/suc-khoe/:id/sua"      element={<ChildHealthForm />} />
          <Route path="/preview/kham-moi"                           element={<ChildHealthForm />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
