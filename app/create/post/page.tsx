// for dropzone or file upload button -> https://docs.uploadthing.com/api-reference/react#use-upload-thing

"use client"

import ResponsiveMenu from '@/components/ResponsiveMenu'
import useTabs from '@/hooks/useTabs'
import { WhoCanReplyPost } from '@/types/types'
import React, { FormEvent, useEffect, useState } from 'react'
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
      <div className="flex justify-between items-center gap-2 my-2">
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
  const [tags, setTags] = useState<string[]>([])

  useEffect(() => console.log(tags), [tags])

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;

    const tag = form.tag.value;

    setTags((prevTags) => {
      if (!prevTags.includes(tag)) {
        return [...prevTags, tag];
      }
      return prevTags;
    });

    form.reset();
  };


  return (
    <>
      <div className='flex flex-col justify-start items-start gap-2 mt-2'>
        <div className="flex justify-start items-center gap-2">
          <span>More about tags</span>
          <ResponsiveMenu
            dropdownMenuOptions={{
              positionX: 'center',
              width: 300
            }}
            trigger={<button className='w-6 h-6 flex justify-center items-center rounded-full border'><BsInfo /></button>}
          >
            {(menuOpen, setMenuOpen) => (
              <div className='p-3 text-lg bg-white dark:bg-neutral-800'>
                Tags will help your post to be shown in feeds to people with similar interests. More tags more chance to appear frequently in the feed!!
              </div>
            )}
          </ResponsiveMenu>
        </div>
        <div className="mt-2 w-full">
          {/* tags */}
          {!tags.length && <div>No tags added</div>}
          {!!tags.length && tags.map((tag, i) => (
            <div key={i}>{tag}</div>
          ))}
          {/* input */}
          <form onSubmit={handleSubmit}>
            <input className='formInput' name='tag' type="text" placeholder='Add tag' />
          </form>
        </div>
      </div>
    </>
  )
}

const PollTab = () => {
  const [title, setTitle] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [duration, setDuration] = useState<number>(1);

  const handleOptionChange = (index: number, value: string) => {
    setOptions((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const addOption = () => {
    if (options.length < 5) {
      setOptions([...options, '']);
    } else {
      alert('You can add up to 5 options only.');
    }
  };

  const removeOption = (index: number) => {
    setOptions((prev) => prev.filter((_, i) => i !== index));
  };

  const resetPoll = () => {
    setTitle('');
    setOptions(['', '']);
    setDuration(1);
  };

  return (
    <div className="my-2">
      <div className="flex flex-col gap-4">
        {/* Poll Title */}
        <div>
          <label htmlFor="poll-title" className="block font-medium">Poll Title</label>
          <input
            id="poll-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="formInput"
            placeholder="Enter poll title"
          />
        </div>

        {/* Poll Options */}
        <div>
          <label className="block font-medium">Options</label>
          <div className="flex flex-col gap-3">
            {options.map((option, index) => (
              <div key={index} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="formInput"
                  placeholder={`Option ${index + 1}`}
                />
                {options.length > 2 && (
                  <button
                    onClick={() => removeOption(index)}
                    className="text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            {options.length < 5 && (
              <button
                onClick={addOption}
                className="text-blue-500 hover:underline"
              >
                Add another option
              </button>
            )}
          </div>
        </div>

        {/* Poll Duration */}
        <div>
          <label htmlFor="poll-duration" className="block font-medium">Duration (days)</label>
          <input
            id="poll-duration"
            type="number"
            value={duration}
            onChange={(e) => setDuration(Math.max(1, Number(e.target.value)))}
            className="formInput"
            min={1}
            max={30}
            placeholder="1"
          />
        </div>

        {/* Reset Button */}
        <button
          onClick={resetPoll}
          className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
        >
          Reset Poll
        </button>
      </div>
    </div>
  );
};


const SchedulePostTab = () => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleSchedule = () => {
    if (!date || !time) {
      alert('Please select both date and time.');
    } else {
      alert(`Post scheduled for ${date} at ${time}.`);
    }
  };

  return (
    <div className='my-2'>
      <div className="flex flex-col gap-3">
        <input
          type="date"
          className="formInput"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <input
          type="time"
          className="formInput"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
        <button onClick={handleSchedule} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
          Schedule Post
        </button>
      </div>
    </div>
  );
};

const MoreOptionsTab = () => {
  const [options, setOptions] = useState({
    allowComments: true,
    showResultsAfterVote: true,
    hideVotes: false,
    allowMultipleVotes: false,
    closeAfterFirstVote: false,
  });

  const handleChange = (key: keyof typeof options) => {
    setOptions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="my-4 p-4 bg-gray-100 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-3">Additional Options</h3>
      <div className="flex flex-col gap-3">
        {/* Option 1 */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={options.allowComments}
            onChange={() => handleChange('allowComments')}
            className="form-checkbox h-5 w-5 text-orange-500 focus:ring-orange-400"
          />
          <span className="text-sm">Allow comments on the poll</span>
        </label>

        {/* Option 2 */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={options.showResultsAfterVote}
            onChange={() => handleChange('showResultsAfterVote')}
            className="form-checkbox h-5 w-5 text-orange-500 focus:ring-orange-400"
          />
          <span className="text-sm">Show results after voting</span>
        </label>

        {/* Option 3 */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={options.hideVotes}
            onChange={() => handleChange('hideVotes')}
            className="form-checkbox h-5 w-5 text-orange-500 focus:ring-orange-400"
          />
          <span className="text-sm">Hide vote counts from participants</span>
        </label>

        {/* Option 4 */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={options.allowMultipleVotes}
            onChange={() => handleChange('allowMultipleVotes')}
            className="form-checkbox h-5 w-5 text-orange-500 focus:ring-orange-400"
          />
          <span className="text-sm">Allow multiple votes</span>
        </label>

        {/* Option 5 */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={options.closeAfterFirstVote}
            onChange={() => handleChange('closeAfterFirstVote')}
            className="form-checkbox h-5 w-5 text-orange-500 focus:ring-orange-400"
          />
          <span className="text-sm">Close poll after the first vote</span>
        </label>
      </div>
    </div>
  );
};
