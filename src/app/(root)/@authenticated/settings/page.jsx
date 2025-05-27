import { Settings } from "./_components/settings"

function SettingsPage() {
  return (
    <div className="pb-10">
      <div className="mb-10">
        <h2 className="text-center text-4xl mb-10 font-light">Settings</h2>
        <p className="font-semibold text-xl text-center"></p>
      </div>
      <Settings />
    </div>
  )
}
export default SettingsPage