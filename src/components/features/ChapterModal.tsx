import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { chapterList } from '~/atoms/chapterListAtom';
import { chapterModal } from '~/atoms/chapterModalAtom';
import { mangaSrc } from '~/atoms/mangaSrcAtom';
import useMultipleSources from '~/context/SourcesContext';
import { Chapter } from '~/types';

import { Dialog, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';

import DetailsChapterList from '../shared/DetailsChapterList';

export default function ChapterModal() {
    const router = useRouter();
    const src = useRecoilValue(mangaSrc);
    const manga = useRecoilValue(chapterList);

    const [sourceSlug, setSourceSlug] = useState(
        router.query.params && String(router.query.params[0]),
    );
    const [currentChapter, setCurrentChapter] = useState(manga?.chapterList);

    const multipleSources = useMultipleSources();
    const [showModal, setShowModal] = useRecoilState(chapterModal);

    const handleCloseModal = () => {
        setShowModal(false);
    };

    useEffect(() => {
        if (multipleSources) {
            const srcInstance = multipleSources.sources.find(
                (source) => source.srcId === src,
            );

            setCurrentChapter(srcInstance?.details.chapterList as Chapter[]);
            setSourceSlug(srcInstance?.slug as string);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [src]);

    return (
        <Transition appear show={showModal} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-[999]"
                onClose={handleCloseModal}
            >
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-100"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed top-1/2 left-0 right-0 -translate-y-1/2 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="max-h-[70vh] w-[85%] transform overflow-x-hidden rounded-2xl bg-background p-6 text-left align-middle shadow-xl transition-all md:w-[75%] lg:max-h-[85vh]">
                                <div className="flex items-center justify-between">
                                    <Dialog.Title
                                        as="h3"
                                        className="my-4 mx-2 font-secondary text-2xl leading-6 text-white md:text-4xl"
                                    >
                                        Chapters:
                                    </Dialog.Title>
                                    <button
                                        onClick={handleCloseModal}
                                        className="button rounded-full p-4 text-white md:mr-6"
                                    >
                                        <XIcon className="h-8 w-8" />
                                    </button>
                                </div>
                                <div className="my-4 flex flex-col">
                                    <DetailsChapterList
                                        highlightCurrentChapter
                                        maxWTitleMobile={90}
                                        containerStyle="flex h-fit w-full flex-col overflow-x-hidden rounded-xl bg-highlight"
                                        mobileHeight={300}
                                        selectSource
                                        comicSlug={sourceSlug as string}
                                        mobileUI={true}
                                        chapterList={
                                            currentChapter?.length > 0
                                                ? currentChapter
                                                : manga.chapterList
                                        }
                                    />
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
