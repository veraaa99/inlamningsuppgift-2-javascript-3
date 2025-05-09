import { ModeToggle } from "@/components/ui/mode-toggle"
import { UserInfoForm } from "./user-info-form"
import { ProfileImageUploader } from "./profile-image-uploader"

export const SettingsForm = ({ user, isOwnUser }) => {
  return (
    <>
        <div className="space-y-10"> 
            {
                isOwnUser && (
                    <div className="flex items-center justify-between lg:justify-stretch gap-10">
                        <p className="font-semibold text-lg">Tema:</p>
                        <ModeToggle />
                    </div>
                )
            }
            <div className="flex items-center justify-between lg:justify-stretch gap-10">
                <p className="font-semibold text-lg">Kortfärg:</p>
                {/* TODO: Gör så att man kan ändra kortfärg */}
            </div>

            <UserInfoForm user={user}/>

            <div className="flex items-center justify-between lg:justify-stretch gap-10">
                <p className="font-semibold text-lg">Profilbild:</p>
                <ProfileImageUploader />
            </div>
        </div>
    </>
  )
}