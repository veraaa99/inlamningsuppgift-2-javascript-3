import { ModeToggle } from "@/components/ui/mode-toggle"
import { UserInfoForm } from "./user-info-form"
import { ProfileImageUploader } from "./profile-image-uploader"
import { ChangePaswordForm } from "./change-password-form"
import { ColorPicker } from "./color-picker"

export const SettingsForm = ({ user, isOwnUser }) => {
  return (
    <>
        <div className="flex flex-col gap-10 justify-between lg:flex-row">
            <div className="space-y-10 w-full"> 
                {
                    isOwnUser && (
                        <div className="flex items-center justify-between lg:justify-stretch gap-10">
                            <p className="font-semibold text-lg">Theme:</p>
                            <ModeToggle />
                        </div>
                    )
                }
                <div className="flex items-center justify-between lg:justify-stretch gap-10">
                    <p className="font-semibold text-lg">Card color:</p>
                    <ColorPicker user={user} />
                </div>

                <UserInfoForm user={user}/>

                <div className="flex items-center justify-between lg:justify-stretch gap-10">
                    <p className="font-semibold text-lg">Profile pic:</p>
                    <ProfileImageUploader user={user} isOwnUser={isOwnUser}/>
                </div>

            </div>

            {
                isOwnUser && <ChangePaswordForm className="bg-green-800 w-full"/>
            }

        </div>
    </>
  )
}