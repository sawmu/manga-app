import Image from 'next/image';
import Link from 'next/link';
import { memo } from 'react';
import {
    MANGA_PATH_DETAILS_NAME,
    MANGA_PATH_NAME,
    TailwindColors,
} from '~/constants';
import useSource from '~/hooks/useSource';
import { NtSearchResponseData } from '~/types';
import { randomColors } from '~/utils/randomColors';
import { useRecoilState } from 'recoil';
import { searchModalState } from '~/atoms/searchModelAtom';
import LazyLoad from 'react-lazyload';

interface SearchResultProps {
    data: NtSearchResponseData[];
}

function SearchResult({ data }: SearchResultProps) {
    const [_, setShowModal] = useRecoilState(searchModalState);

    const [srcId] = useSource();

    return (
        <div className="min-h-fit w-full">
            <ul className="h-fit w-full space-y-5">
                {data.map((manga) => {
                    return (
                        <LazyLoad key={manga.slug} once>
                            <li
                                className="h-fit overflow-x-hidden bg-secondary py-4"
                                onClick={() => setShowModal(false)}
                            >
                                <Link
                                    href={{
                                        pathname: `/${MANGA_PATH_NAME}/${MANGA_PATH_DETAILS_NAME}/${encodeURIComponent(
                                            manga.slug,
                                        )}`,
                                        query: {
                                            src: srcId,
                                        },
                                    }}
                                >
                                    <a className="flex h-full space-x-2">
                                        {/* thumbnail  */}
                                        <figure className="aspect-w-3 relative mt-4 ml-4 h-[120px] w-[90px] min-w-[85px] overflow-hidden rounded-xl">
                                            <Image
                                                className="absolute inset-0 object-cover object-center"
                                                layout="fill"
                                                alt={'img-preview'}
                                                src={manga.thumbnail}
                                            />
                                        </figure>

                                        {/* data info  */}
                                        <div className="flex h-full flex-1 flex-col space-y-4 text-white transition-all hover:text-primary ">
                                            <h2 className="mx-4 mt-4 w-full overflow-hidden font-secondary text-2xl line-clamp-1 md:text-4xl">
                                                {manga.name}
                                            </h2>
                                            <h4 className="mx-4 text-base line-clamp-1 md:text-2xl">
                                                {manga.newChapter}
                                            </h4>
                                            {/* genres  */}
                                            <ul
                                                className={`flex h-[50%] flex-wrap  `}
                                            >
                                                {manga.genres.map((e, idx) => {
                                                    return (
                                                        <li
                                                            style={{
                                                                color: randomColors(
                                                                    TailwindColors,
                                                                    idx,
                                                                ),
                                                            }}
                                                            key={idx}
                                                            className={`absolute-center m-2 h-[40%] w-[75px] rounded-xl bg-background text-[60%]  md:w-fit md:text-xl`}
                                                        >
                                                            <span className="p-4">
                                                                {e}
                                                            </span>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </div>
                                    </a>
                                </Link>
                            </li>
                        </LazyLoad>
                    );
                })}
            </ul>
        </div>
    );
}

export default memo(SearchResult);
