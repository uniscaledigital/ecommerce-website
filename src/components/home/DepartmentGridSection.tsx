import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { DEPARTMENTS } from "@/lib/config/site";

export function DepartmentGridSection() {
  return (
    <section className="my-12 md:my-16">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <p className="text-xs sm:text-sm font-bold tracking-[0.2em] text-commerce uppercase">
            T H E &nbsp; I R I S H &nbsp; G R O C E R &nbsp;·&nbsp; O U R &nbsp; D E PA RT M E N TS
          </p>
          <h2 className="font-serif-display text-2xl sm:text-3xl lg:text-4xl font-bold text-ink mt-1">
            Find your favourites
          </h2>
          <p className="text-sm sm:text-base text-ink-muted mt-1">
            Find your favourites, department by department.
          </p>
        </div>

        {/* 15 Departments Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {DEPARTMENTS.map((dept) => (
            <Link
              key={dept.handle}
              href={`/collections/${dept.handle}`}
              className="group relative rounded-lg overflow-hidden bg-white border border-irishBorder shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              {/* Aspect Ratio 3:2 Banner */}
              <div className="relative aspect-[3/2] w-full overflow-hidden bg-forest-dark">
                <Image
                  src={dept.image}
                  alt={dept.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
              </div>

              {/* Title & Arrow */}
              <div className="p-3.5 sm:p-4 bg-white flex items-center justify-between border-t border-irishBorder/40">
                <span className="font-heading text-xs sm:text-sm font-bold text-ink group-hover:text-commerce transition-colors">
                  {dept.title}
                </span>
                <ArrowUpRight className="w-4 h-4 text-ink-light group-hover:text-commerce transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

