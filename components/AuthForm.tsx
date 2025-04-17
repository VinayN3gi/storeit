'use client'
import React, { useState } from 'react'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Image from 'next/image'


const formSchema = z.object({
    fullName: z.string().min(2).max(50),
    email: z.string().min(2).max(50),
    password: z.string().min(2).max(50),
})

const AuthForm = ({type}:{type:string}) => {

    const [isLoading,setLoading]=useState(true);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          fullName: "",
          email :"",
          password:""
        },
    })
    
    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
    }
    

  return (
    <>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 auth-form">
            <h1 className='form-title'>
                {
                    type=="SignIn" ? "Sign In" : "Sign Up"
                }
            </h1>

            {/*For the username */}
            {type=="SignUp" && 
            <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                <FormItem>
                    <div className='shad-form-item'>
                    <FormLabel className='shad-from-label'>Full Name</FormLabel>
                    <FormControl>
                    <Input placeholder="Enter your full name"  className='shad-input'{...field} />
                    </FormControl>
                    </div>
                    <FormMessage  className='shad-form-message'/>
                </FormItem>
                )}
            />}

            {/*For the email */}
            <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                <FormItem>
                    <div className='shad-form-item'>
                    <FormLabel className='shad-from-label'>Email</FormLabel>
                    <FormControl>
                    <Input type="email"
                    placeholder="Enter your email"  className='shad-input'{...field} />
                    </FormControl>
                    </div>
                    <FormMessage  className='shad-form-message'/>
                </FormItem>)}/>

            {/*For the password */}
            <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                <FormItem>
                    <div className='shad-form-item'>
                    <FormLabel className='shad-from-label'>Password</FormLabel>
                    <FormControl>
                    <Input type='password'
                    placeholder="Enter your password" className='shad-input'{...field} />
                    </FormControl>
                    </div>
                    <FormMessage  className='shad-form-message'/>
                </FormItem>)}/>



            <Button className='form-submit-button' type="submit">
            
            {type=="Sign In" ? "Sign In" : "Sign Up"}

            {
                isLoading &&(
                    <Image src="/assets/icons/loader.svg" alt="loader" width={24} height={24} className='ml-2 animate-spin'/>
                )
            }

            </Button>
            </form>
        </Form>
    </>
  )
}

export default AuthForm