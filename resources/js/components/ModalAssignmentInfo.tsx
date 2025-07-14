import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const statusMap = {
  1: { label: 'Pendiente', color: 'bg-green-100 text-green-800', border: 'border-green-300', icon: '🕒' },
  2: { label: 'En curso', color: 'bg-yellow-100 text-yellow-800', border: 'border-yellow-300', icon: '🔄' },
  3: { label: 'Finalizada', color: 'bg-red-100 text-red-800', border: 'border-red-300', icon: '✔️' },
  atrasada: { label: 'Atrasada', color: 'bg-purple-100 text-purple-800', border: 'border-purple-300', icon: '⚠️' },
  default: { label: 'Desconocido', color: 'bg-gray-100 text-gray-800', border: 'border-gray-300', icon: '📅' },
};

interface ModalAssignmentInfoProps {
  open: boolean;
  onClose: () => void;
  assignment: any;
}

export default function ModalAssignmentInfo({ open, onClose, assignment }: ModalAssignmentInfoProps) {
  if (!assignment) return null;
  // Determinar si es atrasada
  let statusKey: keyof typeof statusMap | 'atrasada' = assignment.status;
  if (
    assignment.status === 1 &&
    new Date(assignment.start) < new Date(new Date().setHours(0, 0, 0, 0))
  ) {
    statusKey = 'atrasada';
  }
  const status = statusMap[statusKey] || statusMap.default;

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="fixed z-50 inset-0 overflow-y-auto" onClose={onClose}>
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-white/30 backdrop-blur-sm transition-opacity" />
          </Transition.Child>

          {/* Centering trick */}
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className={`inline-block align-bottom bg-white rounded-3xl px-4 sm:px-6 pt-16 pb-8 text-left overflow-visible shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full max-w-xs sm:max-w-lg border ${status.border} relative`}>
              {/* Círculo decorativo superior */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-lg border-4 border-white bg-gradient-to-br from-gray-50 to-white z-10">
                <span className="text-3xl sm:text-4xl" aria-label={status.label}>{status.icon}</span>
              </div>
              <div className="mt-4 mb-4 text-center">
                <Dialog.Title as="h3" className="text-lg sm:text-2xl font-extrabold leading-6 text-gray-900 break-words">
                  {assignment.title}
                </Dialog.Title>
                <div className="mt-2 flex justify-center">
                  <span className={`px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-semibold ${status.color} border ${status.border} shadow-sm`}>{status.label}</span>
                </div>
              </div>
              <div className="mb-4 grid grid-cols-1 gap-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
                  <span className="font-semibold text-gray-600">Inicio:</span>
                  <span className="bg-gray-100 rounded px-2 py-1 text-xs sm:text-sm font-mono">
                    {format(new Date(assignment.start), "dd 'de' MMMM yyyy, HH:mm", { locale: es })}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
                  <span className="font-semibold text-gray-600">Fin:</span>
                  <span className="bg-gray-100 rounded px-2 py-1 text-xs sm:text-sm font-mono">
                    {format(new Date(assignment.end), "dd 'de' MMMM yyyy, HH:mm", { locale: es })}
                  </span>
                </div>
              </div>
              {assignment.comments && (
                <div className="mb-4">
                  <span className="font-semibold text-gray-600">Comentarios:</span>
                  <div className="bg-gray-50 border border-gray-200 rounded-xl px-3 sm:px-4 py-2 sm:py-3 mt-2 text-xs sm:text-sm whitespace-pre-line text-gray-700 shadow-inner break-words">
                    {assignment.comments}
                  </div>
                </div>
              )}
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  className="inline-flex justify-center rounded-lg border border-gray-300 shadow px-4 sm:px-6 py-2 bg-gradient-to-r from-gray-50 to-white text-sm sm:text-base font-semibold text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400 transition"
                  onClick={onClose}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
