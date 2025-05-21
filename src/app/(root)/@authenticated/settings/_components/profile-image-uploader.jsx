"use client"

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/authContext";
import { db, storage } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Loader2Icon, LoaderIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const MAX_MB = 5;
const MAX_B = MAX_MB * 1024 * 1024
const MIME_RX = /^image\/(png|jpe?g|webp)$/i

export const ProfileImageUploader = ({ user, isOwnUser }) => {

  const [preview, setPreview] = useState(user?.photoURL || null)
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [imageUploaded, setImageUploaded] = useState(false)

  const { setUser } = useAuth()

  useEffect(() => {
    return () => preview?.startsWith("blob:") && URL.revokeObjectURL(preview)
  }, [preview])
  
  const onPickImage = async (e) => {
    const pickedFile = e.target.files[0]
    if(!pickedFile) return

    if(!MIME_RX.test(pickedFile.type)) {
      setError("Välj en PNG / JPEG / WEBP fil")
      return
    }
    if(pickedFile.size > MAX_B) {
      setError(`Max ${MAX_MB} MB`)
      return
    }

    setError(null)
    setFile(pickedFile)
    setPreview(URL.createObjectURL(pickedFile))
    setImageUploaded(false)
  }

  const handleUpload = async () => {
    if(!file || !user) return 
    setLoading(true)

    try {

      const storageRef = ref(storage, `avatars/${user.uid}`)
      await uploadBytes(storageRef, file, { contentType: file.type })

      const photoURL = await getDownloadURL(storageRef)

      const userRef = doc(db, "users", user.uid)
      await updateDoc(userRef, { photoURL })
      setFile(null)
      setImageUploaded(true)
      if(isOwnUser) {
        setUser(prev => ({ ...prev, photoURL }))
      }

    } catch (error) {
      console.log(error)
      console.error("An error occurred when uploading image. Please try again")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {
        preview 
        ? (
          <>
          <div className="relative">
            <label htmlFor="image-pick" className="block border rounded-lg aspect-square sm:w-80 overflow-hidden">
              <Image alt="Profilbild" src={preview} width={320} height={320} className="object-cover w-full h-full"/>
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-radial from-transparent from-70% to-black/60 to-70%"/>
            </label>
            {
              loading && (
                <div className="absolute flex items-center justify-center inset-0 bg-black/40 pointer-events-auto">
                  <LoaderIcon className="size-20 animate-spin" />
                </div>
              )
            }
          </div>
          

            <div>
              {
                file && !imageUploaded && (
                  <Button className="mt-4" disabled={loading} onClick={handleUpload}>
                    { loading ? "Uploading" : "Save" }
                  </Button>
                )
              }
            </div>
          </>
        )
        : (
          <label htmlFor="image-pick" 
            className="border border-foreground/30 rounded-lg aspect-square flex items-center justify-center bg-gray-500/20 hover:bg-foreground/30 transition-colors cursor-pointer sm:w-80 mx-auto p-10 group"
          >
            <p className="text-muted-foreground group-hover:text-foreground transition-colors">Ladda upp en bild</p>
          </label>
        )
      }
      { error && <p className="text-red-500 text-sm">{ error }</p> }
      <input type="file" id="image-pick" accepts="image/*" className="hidden" onChange={onPickImage}/>
    </div>
  )
}



// export const SettingsForm = ({ userProfile, isOwnUser }) {
// const bla = "Hej"
// <ProfileImageUploader user={userProfile} isOwnUser={bla}/>
// }

// export const ProfileImageUploader = ({ user, isOwnUser})