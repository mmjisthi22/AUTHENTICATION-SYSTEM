import React from 'react'
import { useState } from 'react'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field"
import { Input } from '@/components/ui/input'

function Signin() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handlechanges = (e) => {
        setEmail(e.target.value);
        setPassword(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventdefault();
    }
    return (
    <div className='w-full h-screen flex items-center justify-center'>
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle className="flex justify-center">Sign in</CardTitle>
                <CardDescription className='text-center'>Enter your credentials to securely access your account.</CardDescription>
            </CardHeader>
            <CardContent>
                <form className='flex flex-col gap-5'>
                    <div className='flex flex-col'>
                        <FieldLabel>Email:</FieldLabel>
                        <Input className="p-2" onChange={handlechanges} placeholder='name@example.com' type='text' required/>
                        <FieldDescription></FieldDescription>
                    </div>
                    <div className='flex flex-col'>
                        <FieldLabel>Password:</FieldLabel>
                        <Input className="p-2" onChange={handlechanges} placeholder='••••••••' type='password' required/>
                        <FieldDescription></FieldDescription>
                        <div className='w-full flex justify-end'><Button className='p-0' variant="link">forget password?</Button></div>
                    </div>
                    
                    <div className='flex flex-col'>
                        <Button onClick={handleSubmit}>Sign in</Button>
                    </div>
                    <CardDescription className='text-center'>Don't you have an account? <Button className='p-0' variant="link">Create Account</Button> </CardDescription>
                </form>
            </CardContent>
        </Card>
    </div>
    
  )
}

export default Signin