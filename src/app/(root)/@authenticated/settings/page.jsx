import { Settings } from "./_components/settings"

function SettingsPage() {
  return (
    <div className="pb-10 pt-5">
      <div className="mb-10">
        <p className="font-semibold text-xl text-center">Settings</p>
        <p className="text-sm text-center">Change username and profile pic</p>
      </div>
      <Settings />
    </div>
  )
}
export default SettingsPage