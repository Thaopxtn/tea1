"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { ProductCard } from "@/components/commerce/product-card";
import { Button } from "@/components/ui/button";
import { products } from "@/data/products";

type Answers = {
  strength: "light" | "bold";
  finish: "light" | "deep";
  purpose: "daily" | "gift";
  budget: "under400" | "over400";
  knowledge: "new" | "experienced";
};

const questions = [
  {
    key: "strength",
    label: "Bạn thích vị trà?",
    choices: [
      ["light", "Nhẹ, thanh"],
      ["bold", "Đậm, rõ"],
    ],
  },
  {
    key: "finish",
    label: "Hậu vị mong muốn?",
    choices: [
      ["light", "Ngọt nhẹ"],
      ["deep", "Ngọt sâu"],
    ],
  },
  {
    key: "purpose",
    label: "Bạn dùng trà cho?",
    choices: [
      ["daily", "Hằng ngày"],
      ["gift", "Biếu tặng"],
    ],
  },
  {
    key: "budget",
    label: "Ngân sách cho 100 g?",
    choices: [
      ["under400", "Dưới 400.000đ"],
      ["over400", "Từ 400.000đ"],
    ],
  },
  {
    key: "knowledge",
    label: "Mức độ am hiểu trà?",
    choices: [
      ["new", "Mới bắt đầu"],
      ["experienced", "Đã thưởng trà lâu"],
    ],
  },
] as const;

export function TeaFinder() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<Answers>>({});
  const done = step >= questions.length;
  const recommendations = useMemo(() => {
    return products
      .filter((product) => product.category !== "tra-cu")
      .map((product) => {
        let score = 0;
        const lowest = Math.min(
          ...product.variants.map((variant) => variant.price),
        );
        if (answers.purpose === "gift" && product.collection === "qua-bieu")
          score += 4;
        if (answers.purpose === "daily" && product.collection === "hang-ngay")
          score += 3;
        if (answers.budget === "under400" && lowest < 400_000) score += 2;
        if (answers.budget === "over400" && lowest >= 400_000) score += 2;
        if (
          answers.strength === "bold" &&
          product.taste.some((taste) => taste.includes("đậm"))
        )
          score += 2;
        if (
          answers.strength === "light" &&
          product.taste.some((taste) => /thanh|êm|mềm/.test(taste))
        )
          score += 2;
        if (answers.finish === "deep" && product.aftertaste.includes("Ngọt"))
          score += 1;
        if (
          answers.knowledge === "experienced" &&
          /Đinh|Nõn/.test(product.grade)
        )
          score += 1;
        return { product, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map(({ product }) => product);
  }, [answers]);

  if (done) {
    return (
      <div className="finder-results">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Gợi ý từ dữ liệu hiện có</p>
            <h2>Bốn lựa chọn dành cho bạn</h2>
          </div>
          <Button
            intent="quiet"
            onClick={() => {
              setStep(0);
              setAnswers({});
            }}
          >
            Làm lại
          </Button>
        </div>
        <div className="product-grid">
          {recommendations.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    );
  }

  const question = questions[step];
  return (
    <div className="finder-panel">
      <div key={question.key} className="finder-question">
        <p className="eyebrow">
          Bước {step + 1} / {questions.length}
        </p>
        <h2>{question.label}</h2>
        <p className="muted">
          Không cần tài khoản. Câu trả lời chỉ dùng trong phiên này.
        </p>
      </div>
      <div key={`${question.key}-choices`} className="finder-choices">
        {question.choices.map(([value, label]) => (
          <Button
            key={value}
            intent="secondary"
            onClick={() => {
              setAnswers((current) => ({ ...current, [question.key]: value }));
              setStep((current) => current + 1);
            }}
          >
            {label}
          </Button>
        ))}
        {step > 0 ? (
          <button
            type="button"
            className="text-link"
            onClick={() => setStep((current) => current - 1)}
          >
            Quay lại
          </button>
        ) : null}
      </div>
      <Link className="text-link" href="/san-pham">
        Hoặc xem toàn bộ trà
      </Link>
    </div>
  );
}
