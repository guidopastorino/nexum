// for dropzone or file upload button -> https://docs.uploadthing.com/api-reference/react#use-upload-thing

"use client"

import ResponsiveMenu from '@/components/ResponsiveMenu'
import useTabs from '@/hooks/useTabs'
import { WhoCanReplyPost } from '@/types/types'
import React, { useState } from 'react'
import { BiWorld } from 'react-icons/bi'
import { IoAt } from "react-icons/io5";
import { UploadButton } from "@/utils/uploadthing";
import { MdOutlineCheck, MdOutlinePerson, MdOutlineVerified } from 'react-icons/md'
import { BsInfo } from 'react-icons/bs'

const page = () => {
  const { tab, changeTab } = useTabs()

  const [replyOption, setReplyOption] = useState<WhoCanReplyPost>('Everyone')

  return (
    <div className='w-full p-3'>
      <div>
        <span className="text-xl block w-full font-medium">Create new post!</span>
        <ResponsiveMenu
          trigger={<button className='itemHover rounded-full px-3 py-2'>Select a community/feed</button>}
          dropdownMenuOptions={{
            positionX: 'left',
            canClickOtherElements: false
          }}
        >
          {(menuOpen, setMenuOpen) => (
            <>
              <div className='itemClass itemHover'>
                <div className="w-6 h-6 rounded-full bg-blue-600 shrink-0"></div>
                <span className='truncate line-clamp-1'>Your community 1</span>
              </div>
              <div className='itemClass itemHover'>
                <div className="w-6 h-6 rounded-full bg-blue-600 shrink-0"></div>
                <span className='truncate line-clamp-1'>Lorem ipsum dolor sit amet.</span>
              </div>
              <div className='itemClass itemHover'>
                <div className="w-6 h-6 rounded-full bg-blue-600 shrink-0"></div>
                <span className='truncate line-clamp-1'>Lorem ipsum dolor sit amet consectetur adipisicing.</span>
              </div>
            </>
          )}
        </ResponsiveMenu>
      </div>
      {/* tabs */}
      <div className='flex justify-start items-center gap-2 mt-3 overflow-x-auto'>
        <div onClick={() => changeTab(1)} className={`${tab == 1 ? "activeTab" : ""} p-3 itemHover select-none`}>Content</div>
        <div onClick={() => changeTab(2)} className={`${tab == 2 ? "activeTab" : ""} p-3 itemHover select-none`}>Media</div>
        <div onClick={() => changeTab(3)} className={`${tab == 3 ? "activeTab" : ""} p-3 itemHover select-none`}>Tags</div>
        <div onClick={() => changeTab(4)} className={`${tab == 4 ? "activeTab" : ""} p-3 itemHover select-none`}>Poll</div>
        <div onClick={() => changeTab(5)} className={`${tab == 5 ? "activeTab" : ""} p-3 itemHover select-none`}>Schedule post</div>
        <div onClick={() => changeTab(6)} className={`${tab == 6 ? "activeTab" : ""} p-3 itemHover select-none`}>More options</div>
      </div>
      {/* renders */}
      {tab === 1 && <ContentTab />}
      {tab === 2 && <MediaTab />}
      {tab === 3 && <TagsTab />}
      {tab === 4 && <PollTab />}
      {tab === 5 && <SchedulePostTab />}
      {tab === 6 && <MoreOptionsTab />}
      {/* final options and post button */}
      <div className="flex justify-between items-center gap-2">
        {/* who can reply */}
        <ResponsiveMenu
          trigger={<button className='itemHover rounded-full px-3 py-2'>Who can reply?</button>}
          dropdownMenuOptions={{
            positionX: 'left',
            canClickOtherElements: false
          }}
        >
          {(menuOpen, setMenuOpen) => (
            <>
              {Array.from([{ icon: <BiWorld />, option: "Everyone" }, { icon: <MdOutlinePerson />, option: "Accounts you follow" }, { icon: <MdOutlineVerified />, option: "Verified accounts" }, { icon: <IoAt />, option: "Only accounts you mention" }]).map((el, i) => (
                <div onClick={() => { setReplyOption(el.option as WhoCanReplyPost); setMenuOpen(!menuOpen); }} className="itemhover itemClass">
                  <div className="flex justify-center items-center gap-3">
                    <div className='w-9 h-9 flex justify-center items-center text-white text-lg rounded-full bg-[#1d9bf0]'>
                      {el.icon}
                    </div>
                    <span className='font-medium'>{el.option}</span>
                  </div>
                  {replyOption == el.option && <MdOutlineCheck className='text-[#1d9bf0] text-xl' />}
                </div>
              ))}
            </>
          )}
        </ResponsiveMenu>
        {/* post button */}
        <button className="px-3 py-2 bg-orange-600 hover:bg-orange-700 rounded-full text-white">Post</button>
      </div>
    </div>
  )
}

export default page

const ContentTab = () => {
  return (
    <div className='my-2'>
      <textarea className='p-2 text-lg w-full' placeholder='Post content' name="" id=""></textarea>
    </div>
  )
}

const MediaTab = () => {
  return (
    <>
      <UploadButton
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          // Do something with the response
          console.log("Files: ", res);
          alert("Upload Completed");
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`);
        }}
      />
    </>
  )
}

const TagsTab = () => {
  return (
    <>
      <div className='flex justify-start items-center gap-2'>
        <span>More about tags</span>
        <ResponsiveMenu
          dropdownMenuOptions={{
            positionX: 'center',
            width: 300
          }}
          trigger={<button className='w-6 h-6 flex justify-center items-center rounded-full border'><BsInfo /></button>}
        >
          {(menuOpen, setMenuOpen) => (
            <div className='p-2 text-lg'>
              Tags will help your post to be shown in feeds to people with similar interests. More tags more chance to appear frequently in the feed!!
            </div>
          )}
        </ResponsiveMenu>
      </div>
    </>
  )
}

const PollTab = () => {
  return (
    <></>
  )
}

const SchedulePostTab = () => {
  return (
    <></>
  )
}

const MoreOptionsTab = () => {
  return (
    <></>
  )
}