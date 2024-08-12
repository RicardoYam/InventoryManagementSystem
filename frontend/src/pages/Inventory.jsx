import { Search } from "lucide-react";
import DropdownPage, { DropdownPageItem } from "../components/DropdownPage";
import { MenuButton } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import Stock from "../components/stock";

export default function Inventory() {
  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center bg-white rounded-t-lg px-4 py-2">
        <div>
          <h1 className="text-ms font-semibold">Inventory</h1>
          <span className="text-xs text-gray-700">756 Products</span>
        </div>
        <form action="Post" className="flex">
          <span class="inline-flex items-center px-3 text-ms text-gray-900 bg-gray-200 border rounded-e-0 border-gray-300 border-e-0 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
            <Search size={20} />
          </span>
          <input
            type="text"
            id="search"
            className="rounded-none rounded-e-lg bg-indigo-50 border h-8 text-xs pl-2 focus:outline-none"
            placeholder="Search"
          ></input>
        </form>
      </div>

      <div className="flex justify-between border-t bg-white my-1 rounded-t-lg px-4 py-2 text-sm">
        <div className="flex gap-4">
          <div className="flex flex-col items-start p-2 ">
            <label className="mx-2 mb-2 text-gray-700">From Date</label>
            <input
              type="date"
              className="p-2 w-36 border rounded-md text-gray-600 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="yy/mm/dd"
            />
          </div>
          <div className="flex flex-col items-start p-2">
            <label className="mx-2 mb-2 text-gray-700">To Date</label>
            <input
              type="date"
              className="p-2 w-36 border rounded-md text-gray-600 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="yy/mm/dd"
            />
          </div>
        </div>
        <div className="flex gap-4 p-2 justify-center items-center">
          <DropdownPage
            trigger={
              <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                All Category
                <ChevronDownIcon
                  aria-hidden="true"
                  className="-mr-1 h-5 w-5 text-gray-400"
                />
              </MenuButton>
            }
          >
            <DropdownPageItem>Jacket</DropdownPageItem>
            <DropdownPageItem>Pants</DropdownPageItem>
          </DropdownPage>

          <DropdownPage
            trigger={
              <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                Sorted By
                <ChevronDownIcon
                  aria-hidden="true"
                  className="-mr-1 h-5 w-5 text-gray-400"
                />
              </MenuButton>
            }
          >
            <DropdownPageItem>Name</DropdownPageItem>
            <DropdownPageItem>Price</DropdownPageItem>
          </DropdownPage>
        </div>
      </div>

      <div className="flex flex-col justify-between text-sm">
        <Stock />
        <Stock />
      </div>
    </div>
  );
}
