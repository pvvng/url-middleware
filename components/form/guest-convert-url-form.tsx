"use client";

import Button from "@/components/form-button";
import Input from "@/components/form-input";
import { convertUrl } from "@/app/(url)/actions";
import { LocalURLType } from "@/util/types/short-key";
import { getLocalURLs, setLocalURLs } from "@/util/local-urls/local-urls";
import { getUniqueKeys } from "@/util/local-urls/get-unique-keys";
import { useActionState, useEffect, useState } from "react";
import { formDeafultValue } from "@/lib/create-result-object";
import UrlCard from "../url-card";
import Link from "next/link";
import { handleFocus } from "@/util/input-hadle-focus";

export default function GuestConvertUrlForm() {
  const [actionResult, action] = useActionState(convertUrl, formDeafultValue);
  const [previousURLs, setPreviousURLs] = useState<LocalURLType[]>([]);

  // 키 설정을 위한 초기화 및 검증
  useEffect(() => {
    // 웹사이트 origin-url 불러오기 및 이전 URL 설정
    const initializeURLs = () => {
      const localURLs = getLocalURLs();
      setPreviousURLs(localURLs);
    };

    initializeURLs();
  }, []);

  useEffect(() => {
    if (actionResult.success && actionResult.result) {
      const newKey: LocalURLType = actionResult.result;
      const updatedKeys = getUniqueKeys(previousURLs, newKey).slice(0, 10);

      setPreviousURLs(updatedKeys);
      setLocalURLs(updatedKeys);
    }
  }, [actionResult]);

  return (
    <div className="max-w-screen-sm mx-auto flex flex-col justify-center gap-5 p-5">
      <h1 className="text-2xl font-semibold">✂ 긴 URL 짧게 만드는 사이트</h1>
      <form action={action} className="flex flex-col justify-center gap-3">
        <Input
          name="url"
          type="url"
          placeholder="단축할 URL을 입력하세요."
          required
          onFocus={handleFocus}
          errors={!actionResult.success ? actionResult.formErrors : []}
        />
        <Button text="URL 단축하기" />
      </form>
      <div className="border-2 shadow-md border-neutral-200 rounded-xl dark:border-neutral-400">
        <div className="border-b-2 border-b-neutral-200 dark:border-b-neutral-400 p-5">
          <p className="font-semibold text-lg">로그인하고 더 편하게 사용하기</p>
          <p className="my-2">
            구글, 카카오 아이디로{" "}
            <span className="font-semibold">1초만에 로그인</span>하고 더 편하게
            서비스를 이용해보세요!
          </p>
          <hr className="dark:border-neutral-400" />
          <div className="mb-5 flex flex-col gap-2 mt-2">
            <p className="font-semibold text-lg">간편 로그인 혜택</p>
            <ul className="list-decimal list-inside flex flex-col gap-1">
              <li>개수 제한 없이 URL 변경하고 저장하기</li>
              <li>변경한 URL 별명으로 저장하기</li>
              <li>별명으로 저장한 URL 검색하기</li>
            </ul>
          </div>
          <Link
            href="/login"
            className="rounded-lg border border-blue-600 text-blue-600 transition-colors px-3 p-2
            hover:border-blue-500 hover:bg-blue-500 hover:text-white font-semibold"
          >
            로그인 페이지로 이동하기
          </Link>
        </div>
        <div className="border-b-2 border-b-neutral-200 p-5 dark:border-b-neutral-400">
          <p className="font-semibold text-lg mb-2">사용 방법</p>
          <ul className="list-decimal list-inside flex flex-col gap-2">
            <li>입력창에 단축하고 싶은 URL을 복사해서 붙여넣습니다.</li>
            <li>단축된 URL을 브라우저 주소창에 붙여넣습니다.</li>
          </ul>
        </div>
        <div className="flex flex-col gap-3 p-5">
          <h2 className="font-semibold text-lg">
            이전 변경 내역 (클릭하여 복사하기)
          </h2>
          <p className="text-sm text-neutral-500">
            최근 10개의 변경 내역만 저장됩니다.
          </p>
          {previousURLs.length === 0 && (
            <p>URL 단축 내역이 존재하지 않습니다.</p>
          )}
          {previousURLs.map((url) => (
            <UrlCard key={url.shortKey} {...url} type="guest" />
          ))}
        </div>
      </div>
    </div>
  );
}
