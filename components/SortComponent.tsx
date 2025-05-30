'use client'
import React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { usePathname, useRouter } from 'next/navigation'
import { sortTypes } from '@/constants'
import { useFileContext } from '@/provider/FileContext'

const SortComponent = () => {
  const router=useRouter()
  const path=usePathname()
   const {triggerRefresh}=useFileContext()
  const handleSort=(value:string)=>{
    triggerRefresh()
    router.push(`${path}?sort=${value}`)
  }
 

  return (
   <Select onValueChange={handleSort} defaultValue={sortTypes[0].value}>
  <SelectTrigger className="sort-select">
    <SelectValue placeholder={sortTypes[0].value} />
  </SelectTrigger>
  <SelectContent className='sort-select-content'>
    {
      sortTypes.map((sort)=>(
        <SelectItem key={sort.label} value={sort.value} className='shad-select-item'>
          {sort.label}
        </SelectItem>
      ))
    }
  </SelectContent>
</Select>

  )
}

export default SortComponent