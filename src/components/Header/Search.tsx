import { Dialog, Transition } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";

interface ISearchProps {
  children?: React.ReactNode;
}

const Search = (props: ISearchProps) => {
  const router = useRouter();

  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const query = e.currentTarget.query.value;
    if (query) {
      router.push(`/search?query=${query}`);
      closeModal();
    }
  }

  return (
    <>
      <div className="inset-0 flex items-center justify-center">
        <div onClick={openModal}>{props.children}</div>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-slate-900/25 opacity-100 backdrop-blur transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="mt-[8%] flex min-h-full items-start justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="min-w-[500px] overflow-hidden rounded-lg bg-white shadow-md transition-all">
                  <form onSubmit={handleSubmit}>
                    <input
                      className="block w-full appearance-none bg-transparent py-4 pl-4 pr-12 text-base text-slate-900 placeholder:text-slate-600 focus:outline-none sm:text-sm sm:leading-6"
                      placeholder="Arama yapın..."
                      type="text"
                      style={{ caretColor: "rgb(107, 114, 128)" }}
                      tabIndex={0}
                      name="query"
                      id="query"
                    />
                  </form>
                  <MagnifyingGlassIcon className="pointer-events-none absolute right-4 top-4 h-6 w-6 text-slate-400" />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default Search;
