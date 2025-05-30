"use client";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Card, CardHeader } from "@/components/ui/card";
import { useSidebar } from "@/hooks/use-sidebar";
import { useStore } from "@/hooks/use-store";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/firebaseConfig";
import { ExpandableCard } from "@/app/component/ExpandableCard/ExpandableCard";
import { experience } from "@/data/data";
import { useState, useEffect, useRef } from "react";
import { ArrowUpFromDot, Loader } from "lucide-react";

const ITEMS_PER_PAGE = 6;

export default function CryptoJournalPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const router = useRouter();
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const loadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
  };

  const loadLess = () => {
    setVisibleCount((prev) => Math.max(prev - ITEMS_PER_PAGE, ITEMS_PER_PAGE));
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const sidebar = useStore(useSidebar, (x) => x);
  if (!sidebar) return null;

  return (
    <ContentLayout title="Hành trình tôi đi tìm tôi">
      <Card className="max-h-[67.5vh] overflow-auto shadow-lg border border-black-200 dark:border-black-700 mb-2">
        <CardHeader>
          <div className="font-bold text-2xl text-black-800 dark:text-white">
            TRADING PHIÊU LƯU KÍ
          </div>
        </CardHeader>
      </Card>

      {experience.slice(0, visibleCount).map((item, index) => (
        <ExpandableCard
          key={index}
          title={item.title}
          content={item.content}
          isOpen={openIndex === index}
          onClick={() => setOpenIndex(openIndex === index ? null : index)}
        />
      ))}
      <div className="flex justify-center mt-4 space-x-4">
        {visibleCount < experience.length && (
          <Loader onClick={loadMore} className="cursor-pointer" />
        )}
        {visibleCount > ITEMS_PER_PAGE && <ArrowUpFromDot onClick={loadLess} />}
      </div>
    </ContentLayout>
  );
}
