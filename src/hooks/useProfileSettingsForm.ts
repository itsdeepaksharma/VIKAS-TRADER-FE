import { FormEvent, useMemo, useRef, useState } from 'react';

import { updateProfile } from '../api/users';
import { getApiErrorMessage } from '../api/client';
import {
  isValidIndianPhone,
  normalizeIndianPhone,
  PHONE_VALIDATION_MESSAGE,
  sanitizePhoneInput,
} from '../lib/phone';
import { useAuthStore } from '../store/authStore';

type UseProfileSettingsFormOptions = {
  onSuccess?: () => void;
};

export function useProfileSettingsForm(options: UseProfileSettingsFormOptions = {}) {
  const user = useAuthStore((s) => s.user);
  const updateProfileState = useAuthStore((s) => s.updateProfile);
  const fileRef = useRef<HTMLInputElement>(null);

  const savedSnapshot = useMemo(
    () => ({
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      phone: sanitizePhoneInput(user?.mobile ?? ''),
      address: user?.address ?? '',
      avatarUrl: user?.avatarUrl,
    }),
    [user],
  );

  const [firstName, setFirstName] = useState(savedSnapshot.firstName);
  const [lastName, setLastName] = useState(savedSnapshot.lastName);
  const [phone, setPhone] = useState(savedSnapshot.phone);
  const [address, setAddress] = useState(savedSnapshot.address);
  const [draftAvatarUrl, setDraftAvatarUrl] = useState(savedSnapshot.avatarUrl);
  const [error, setError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const isDirty = useMemo(
    () =>
      firstName !== savedSnapshot.firstName ||
      lastName !== savedSnapshot.lastName ||
      phone !== savedSnapshot.phone ||
      address !== savedSnapshot.address ||
      draftAvatarUrl !== savedSnapshot.avatarUrl,
    [firstName, lastName, phone, address, draftAvatarUrl, savedSnapshot],
  );

  function handleAvatarChange(file: File | undefined) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setDraftAvatarUrl(reader.result as string);
      setSuccess('');
    };
    reader.readAsDataURL(file);
  }

  function handleDiscard() {
    setFirstName(savedSnapshot.firstName);
    setLastName(savedSnapshot.lastName);
    setPhone(savedSnapshot.phone);
    setAddress(savedSnapshot.address);
    setDraftAvatarUrl(savedSnapshot.avatarUrl);
    setError('');
    setPhoneError('');
    setSuccess('');
    if (fileRef.current) fileRef.current.value = '';
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setPhoneError('');
    setSuccess('');

    const normalizedPhone = normalizeIndianPhone(phone);
    if (!isValidIndianPhone(normalizedPhone)) {
      setPhoneError(PHONE_VALIDATION_MESSAGE);
      return;
    }

    setLoading(true);
    try {
      const updated = await updateProfile({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone: normalizedPhone,
        address: address.trim(),
        avatar_url: draftAvatarUrl ?? null,
      });
      updateProfileState(updated);
      setSuccess('Profile updated successfully.');
      options.onSuccess?.();
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not update profile.'));
    } finally {
      setLoading(false);
    }
  }

  return {
    user,
    fileRef,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    phone,
    setPhone,
    address,
    setAddress,
    draftAvatarUrl,
    error,
    phoneError,
    setPhoneError,
    success,
    loading,
    isDirty,
    handleAvatarChange,
    handleDiscard,
    handleSubmit,
  };
}

export function getProfileInitials(firstName: string, lastName: string, fallback = 'VT') {
  const initials = `${firstName.trim().charAt(0)}${lastName.trim().charAt(0)}`.toUpperCase();
  return initials.trim() || fallback;
}
