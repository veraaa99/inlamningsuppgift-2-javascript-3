import { ModeToggle } from "@/components/ui/mode-toggle"
import { UserInfoForm } from "./user-info-form"
import { ProfileImageUploader } from "./profile-image-uploader"
import { ChangePaswordForm } from "./change-password-form"
import { ColorPicker } from "./color-picker"
import { UserRolesManager } from "./user-roles-manager"

export const SettingsForm = ({ user, isOwnUser }) => {
  return (
    <>
        <div className="flex flex-col gap-10 justify-between lg:flex-row">
            <div className="space-y-10 w-full"> 
                
                {/* <div className="flex items-center justify-between lg:justify-stretch gap-10">
                    <p className="font-semibold text-lg">Card color:</p>
                    <ColorPicker user={user} />
                </div> */}

                <UserInfoForm user={user}/>

                <div className="flex flex-col gap-10 justify-between">
                    <div className="flex flex-col gap-5">
                        <h3 className="font-semibold text-xl">Profile pic:</h3>
                        <ProfileImageUploader user={user} isOwnUser={isOwnUser}/>

                    </div>
                    
                </div>

            </div>
            
                {
                    isOwnUser && <ChangePaswordForm className="bg-gradient-to-b from-cyan-950 to-transparent w-full"/>
                }
                
        </div>
        {
            isOwnUser && (
                <div className="flex flex-row items-center justify-between self-center border-1 border-neutral-500 rounded-lg w-full h-10 p-5 mt-15 lg:w-100">
                    <p className="font-semibold text-md">Theme:</p>
                    <ModeToggle />
                </div>
            )
        }
        {
            isOwnUser && <UserRolesManager />
        }
    </>
  )
}