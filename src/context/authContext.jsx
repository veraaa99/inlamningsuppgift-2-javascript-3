"use client"

import { auth, db } from "@/lib/firebase"
import { createUserWithEmailAndPassword, EmailAuthProvider, getAuth, onAuthStateChanged, reauthenticateWithCredential, sendEmailVerification, signInWithEmailAndPassword, signOut, updatePassword, updateProfile } from "firebase/auth"
import { doc, getDoc, setDoc, Timestamp, updateDoc } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { createContext, useContext, useEffect, useState } from "react"
import toast from "react-hot-toast"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(false)
    const [authLoaded, setAuthLoaded] = useState(false)

    const router = useRouter()

    useEffect(() => {
      const unsub = onAuthStateChanged(auth, async(firebaseUser) => {
        if(!firebaseUser) {
            setUser(null)
            setAuthLoaded(true)
            return
        }
        
        const docRef = doc(db, "users", firebaseUser.uid)

        if(firebaseUser?.emailVerified) {
            await updateDoc(docRef, {
                verified: firebaseUser.emailVerified
            })
        }

        // const docSnap = await getDoc(docRef)
        // if(docSnap.exists()) {
        //     setUser(docSnap.data())
        // }

        const getUserDocWithRetry = async(retries = 5, delay = 300) => {
            let docSnap = null
            for(let i = 0; i < retries; i++) {
                docSnap = await getDoc(docRef)
                if(docSnap.exists()) break

                await new Promise(resolve => setTimeout(resolve, delay))
            }

            return docSnap
        }

        const docSnap = await getUserDocWithRetry()

        if(docSnap && docSnap.exists()) {
            setUser(docSnap.data())
        } else {
            console.warn("Användardokument kunde inte hämtas")
            setUser(null)
        }

        setAuthLoaded(true)

      })

      return () => unsub()
    }, [])
    
    const register = async (email, password, displayName) => {
        setLoading(true)

        try {
            const res = await createUserWithEmailAndPassword(auth, email, password)
            await updateProfile(res.user, { displayName })

            if(!res.user) {
                console.log("no user")
                return
            }
            
            const docRef = doc(db, "users", res.user.uid)

            await setDoc(docRef, {
                uid: res.user.uid,
                email: res.user.email,
                displayName: res.user.displayName,
                role: "user",
                createdAt: Timestamp.now(),
                photoURL: null,
                verified: false,
                color: "#9dedcc"
            })

            await verifyEmail()
            
        } catch (err) {
            console.log("Error registering the user: ", err)
            throw err
        } finally {
            setLoading(false)
        }

    }

    const logout = async() => {
        router.replace("/")
        await signOut(auth)
    }

    const login = async(email, password) => {
        setLoading(true)
        try {
            await signInWithEmailAndPassword(auth, email, password)
            
        } catch (err) {
            console.log("Error signing in: ", err)
            throw err
        } finally {
            setLoading(false)
        }
    }

    const isAdmin = () => {
        if (!user) return false
        return user.role === "admin"
    }

    const updateUser = async(user, newUserData) => {
        setLoading(true)
        const toastId = toast.loading("Loading...")
        try {
            const useRef = doc(db, "users", user.uid)
            await updateDoc(useRef, newUserData)
            setUser((prevUser) => ({ ...prevUser, ...newUserData }))
            toast.success("Profile updated", { id: toastId})
            
        } catch (error) {
            toast.error("Something went wrong. Please try again", { id: toastId })
            console.error("Error updating the user: ", error)
        } finally {
            setLoading(false)
        }
    }

    const verifyEmail = async () => {
        const toastId = toast.loading("Sending verification link...")
        const user = auth.currentUser

        if(!user) {
            console.error("No user is signed in")
            toast.error("Something went wrong. Please try again", { id: toastId })
            return
        }

        try {
            await sendEmailVerification(user, {
                url: `${window.location.origin}/`,
                handleCodeInApp: false
            })
            toast.success("Verification link sent. Check your email to finish your registration", { id: toastId })
            
        } catch (error) {
            console.error("Error sending email verification: ", error)
            toast.error("Error sending email verification: ", error)
        }
    }

    const changePassword = async(currentPassword, newPassword) => {
        setLoading(true)
        const toastId = toast.loading("Loading...")
        const user = auth.currentUser

        if(!user) {
            console.error("No user is signed in")
            toast.error("No user is signed in", { id: toastId })
            return
        }

        try {
            const userCredential = await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email, currentPassword))
            await updatePassword(userCredential.user, newPassword)
            toast.success("Password succesfully updated!", { id: toastId })
        } catch (error) {
            console.error("Error reauthenticating user: ", error)
             if(error.code === "auth/invalid-credential") {
                toast.error("Wrong password", { id: toastId })
            } else if (error.code === "auth/weak-password") {
                toast.error("Password is too weak", { id: toastId })
            } else {
                toast.error("Something went wrong. Please try again", { id: toastId })
            }
            throw error
        } finally {
            setLoading(false)
        }
    }

    const values = {
        user,
        setUser,
        loading,
        authLoaded,
        register,
        logout,
        login,
        isAdmin,
        updateUser,
        changePassword,
        verifyEmail
    }

    return (
        <AuthContext.Provider value={values}>
            { children }
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if(!context) {
        throw new Error("useAuth must be used inside an Authprovider")
    }
    return context
}