import { getSettings } from '@/actions/settings.action'
import SettingsForm from '@/components/forms/settings-form/settings'
import React from 'react'

const Page = async() => {
  const settings = await getSettings();
  return (
    <div>
      <SettingsForm initialData={settings} />
    </div>
  )
}

export default Page