'use client'
import React, {useState } from 'react'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Link from 'next/link'
import { createAccount,signIn } from '@/lib/action/user.action'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/provider/AuthContext'
import { motion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'


const authFormSchema =(type:string)=> { 
    return z.object({
    fullName:type=="SignUp" ?  z.string()
        .min(2, "Full Name must be at least 2 characters")
        .max(50, "Full Name cannot exceed 50 characters") : z.string().optional(),
    email: z.string()
        .email("Please enter a valid email address"),
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .max(50, "Password cannot exceed 50 characters")
})}



const AuthForm = ({ type }: { type: string }) => {

    const {setUser}=useAuth();
    const router=useRouter();
    const [isLoading, setLoading] = useState(false)
    const [errorMesage, setErrorMessaage] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const linkHref = type === "SignIn" ? "/sign-up" : "/sign-in"
    const buttonText = type === "SignIn" ? "Sign In" : "Sign Up"
    const linkText = type === "SignIn" ? "Sign Up" : "Sign In"
    const questionText = type === "SignIn" 
        ? "Don't have an account ? " 
        : "Already have an account ?"
    

    const formSchema=authFormSchema(type);
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: "",
            email: "",
            password: ""
        },
    })

    const {reset}=form;

    const SignIn=async (email:string,password:string)=>
    {
        setLoading(true);
        try {
            const result=await signIn({email,password});
            if(result.session)
            {

                setUser({
                    id: result.session.userId, 
                    email: email,
                })
                console.log("User logged in ",result.session);
                router.replace("/home")
            }
            else
            {
                setErrorMessaage(result.error || 'An error occurred during user log in ');
            }
        } catch (error:any) {
            setLoading(false);
            setErrorMessaage(error.message || 'An error occurred during user log in')
            reset();
        }
      
    
    }

    const SignUp=async(email:string,password:string,fullName:string)=>
    {
        setLoading(true);
        try {
            const result=await createAccount({fullName,email,password});
            if(result.success)
            {
                console.log("User created ",result.user)
                router.replace("/home")
            }
            else
            {
                setErrorMessaage(result.error || 'An error occurred during sign-up');
            }
            
        } catch (error:any) {
            setLoading(false)
            setErrorMessaage(error.message || 'An error occured during sign-up')
            reset();
        }
      
    }


    function onSubmit(values: z.infer<typeof formSchema>) {
        
        if(type=="SignUp")
        {
            SignUp(values.email,values.password,values.fullName!);
        }
        else
        {
            SignIn(values.email,values.password);
        }
    }

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 auth-form">
                    <div className="space-y-2 text-center md:text-left">
                        <h1 className='form-title'>
                            {type === "SignIn" ? "Sign In" : "Create Account"}
                        </h1>
                        <p className="text-[14px] text-slate-500 leading-[20px]">
                            {type === "SignIn" 
                              ? "Welcome back! Please enter your details to access your storage." 
                              : "Get started for free and manage your files securely."}
                        </p>
                    </div>

                    {/* For the username */}
                    {type === "SignUp" && (
                        <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                                <FormItem>
                                    <div className='shad-form-item'>
                                        <FormLabel className='shad-form-label'>Full Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your full name" className='shad-input' {...field} />
                                        </FormControl>
                                    </div>
                                    <FormMessage className='shad-form-message' />
                                </FormItem>
                            )}
                        />
                    )}

                    {/* For the email */}
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <div className='shad-form-item'>
                                    <FormLabel className='shad-form-label'>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="Enter your email"
                                            className='shad-input'
                                            {...field}
                                        />
                                    </FormControl>
                                </div>
                                <FormMessage className='shad-form-message' />
                            </FormItem>
                        )}
                    />

                    {/* For the password */}
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <div className='shad-form-item relative'>
                                    <FormLabel className='shad-form-label'>Password</FormLabel>
                                    <FormControl>
                                        <div className="relative w-full flex items-center">
                                            <Input
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="Enter your password"
                                                className='shad-input pr-10'
                                                {...field}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword((prev) => !prev)}
                                                className="absolute right-0 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="w-5 h-5" />
                                                ) : (
                                                    <Eye className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>
                                    </FormControl>
                                </div>
                                <FormMessage className='shad-form-message' />
                            </FormItem>
                        )}
                    />

                    <Button className='form-submit-button w-full' type="submit" disabled={isLoading}>
                        {!isLoading && buttonText}
                        {isLoading && (
                            <div className="flex items-center justify-center gap-2">
                                <motion.div
                                    className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"
                                    initial={{ rotate: 0 }}
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, ease: 'linear', duration: 1 }}
                                />
                                <span>Processing...</span>
                            </div>
                        )}
                    </Button>

                    {errorMesage && (
                        <p className='error-message'>{errorMesage}</p>
                    )}

                    <div className='body flex justify-center text-[14px] mt-4'>
                        <p className='text-slate-500'>
                            {questionText}
                        </p>
                        <Link
                            href={linkHref}
                            className='ml-1 font-semibold text-brand hover:underline'
                        >
                            {linkText}
                        </Link>
                    </div>
                </form>
            </Form>
        </>
    )
}

export default AuthForm