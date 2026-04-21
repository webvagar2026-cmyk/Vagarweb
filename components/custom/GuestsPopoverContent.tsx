"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

export interface Guests {
  adultsAndChildren: number;
  infants: number;
}

interface GuestsPopoverContentProps {
  guests: Guests;
  handleGuestChange: (
    type: keyof Guests,
    operation: "increment" | "decrement"
  ) => void;
  maxGuests?: number;
}

export const GuestsPopoverContent: React.FC<GuestsPopoverContentProps> = ({
  guests,
  handleGuestChange,
  maxGuests = 16,
}) => {
  const adultsLimit = Math.min(16, maxGuests);
  const infantsLimit = 16;

  return (
    <div className="grid gap-4 pl-6 pr-5 py-4 text-sm ">
      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold">Adultos y Niños</p>
            <p className="text-xs text-gray-500">2 o más años</p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-8 w-8"
              onClick={() => handleGuestChange("adultsAndChildren", "decrement")}
              disabled={guests.adultsAndChildren <= 0}
            >
              -
            </Button>
            <span>{guests.adultsAndChildren}</span>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-8 w-8"
              onClick={() => handleGuestChange("adultsAndChildren", "increment")}
              disabled={guests.adultsAndChildren >= adultsLimit}
            >
              +
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div>
            <p className="font-semibold">Bebés</p>
            <p className="text-xs text-gray-500">Menores de 2 años</p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-8 w-8"
              onClick={() => handleGuestChange("infants", "decrement")}
              disabled={guests.infants <= 0}
            >
              -
            </Button>
            <span>{guests.infants}</span>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-8 w-8"
              onClick={() => handleGuestChange("infants", "increment")}
              disabled={guests.infants >= infantsLimit}
            >
              +
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
