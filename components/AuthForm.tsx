'use client'
import React, {useEffect, useState } from 'react'
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
import Image from 'next/image'
import Link from 'next/link'
import { createAccount,signIn } from '@/lib/action/user.action'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/provider/AuthContext'
import { motion } from 'framer-motion'


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
            setErrorMessaage(error.message || 'An error occurred during user log in')
            reset();
        }
        setLoading(false);
    
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
            setErrorMessaage(error.message || 'An error occured during sign-up')
            reset();
        }
        setLoading(false)
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
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 auth-form">
                    <h1 className='form-title mt-8'>
                        {type === "SignIn" ? "Sign In" : "Sign Up"}
                    </h1>

                    {/* For the username */}
                    {type === "SignUp" &&
                        <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                                <FormItem>
                                    <div className='shad-form-item'>
                                        <FormLabel className='shad-from-label'>Full Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your full name" className='shad-input' {...field} />
                                        </FormControl>
                                    </div>
                                    <FormMessage className='shad-form-message' />
                                </FormItem>
                            )}
                        />
                    }

                    {/* For the email */}
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <div className='shad-form-item'>
                                    <FormLabel className='shad-from-label'>Email</FormLabel>
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
                                <div className='shad-form-item'>
                                    <FormLabel className='shad-from-label'>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='password'
                                            placeholder="Enter your password"
                                            className='shad-input'
                                            {...field}
                                        />
                                    </FormControl>
                                </div>
                                <FormMessage className='shad-form-message' />
                            </FormItem>
                        )}
                    />

                    <Button className='form-submit-button' type="submit">
                        {!isLoading && buttonText}
                        {isLoading && (
                            <motion.div
                            className="w-11 h-11 border-4 border-t-transparent border-white rounded-full animate-spin"
                            initial={{ rotate: 0 }}
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, ease: 'linear', duration: 1 }}
                          />
                        )}
                    </Button>

                    {errorMesage &&
                        <p className='error-message'>{errorMesage}</p>
                    }

                    <div className='body flex flex-2 justify-center'>
                        <p className='text-light-100'>
                            {questionText}
                        </p>
                        <Link
                            href={linkHref}
                            className='ml-1 font-medium text-brand-100'
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