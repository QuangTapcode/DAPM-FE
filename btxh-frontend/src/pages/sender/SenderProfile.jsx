import { useAuth } from '../../hooks/useAuth';
import ProfileForm from '../../components/profile/ProfileForm';

export default function SenderProfile() {
  const { user } = useAuth();

  const handleSave = async (payload) => {
    console.log('Update sender profile:', payload);
    // await senderApi.updateProfile(payload);
    await new Promise((resolve) => setTimeout(resolve, 600));
  };

  return (
    <ProfileForm
      user={user}
      formId="sender-profile-form"
      title="Thông tin cá nhân"
      description="Cập nhật thông tin chính xác để trung tâm thuận tiện liên hệ và xử lý hồ sơ gửi trẻ."
      onSave={handleSave}
    />
  );
}