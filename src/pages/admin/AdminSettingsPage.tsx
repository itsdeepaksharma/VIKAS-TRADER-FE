import { ProfileSettingsForm } from '../../components/profile/ProfileSettingsForm';
import { useProfileSettingsForm } from '../../hooks/useProfileSettingsForm';

export function AdminSettingsPage() {
  const form = useProfileSettingsForm();

  return (
    <div>
      <div className="mb-6 hidden sm:mb-8 lg:block">
        <h1 className="vt-page-title">Settings</h1>
        <p className="vt-page-desc">Manage your admin profile and account details</p>
      </div>

      <div className="mx-auto max-w-xl">
        <ProfileSettingsForm
          fileRef={form.fileRef}
          firstName={form.firstName}
          setFirstName={form.setFirstName}
          lastName={form.lastName}
          setLastName={form.setLastName}
          phone={form.phone}
          setPhone={form.setPhone}
          address={form.address}
          setAddress={form.setAddress}
          draftAvatarUrl={form.draftAvatarUrl}
          email={form.user?.email}
          error={form.error}
          phoneError={form.phoneError}
          setPhoneError={form.setPhoneError}
          success={form.success}
          loading={form.loading}
          isDirty={form.isDirty}
          onAvatarChange={form.handleAvatarChange}
          onDiscard={form.handleDiscard}
          onSubmit={form.handleSubmit}
        />
      </div>
    </div>
  );
}
