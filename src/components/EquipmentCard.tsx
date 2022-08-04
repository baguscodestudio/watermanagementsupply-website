import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import moment from 'moment';

import { PriceTag3 } from '@styled-icons/remix-line/PriceTag3';
import { Calendar } from '@styled-icons/bootstrap/Calendar';
import { Activity } from '@styled-icons/evaicons-solid/Activity';
import { TimeFive } from '@styled-icons/boxicons-regular/TimeFive';

import EquipmentType from '../type/Equipment';
import { extendedEquipment } from '../pages/Equipment/Equipment';

const EquipmentCard = ({
  equipment,
  pump,
}: {
  equipment: EquipmentType;
  pump: extendedEquipment[];
}) => {
  const renderSchedule = () => {
    let schedule = pump.find(
      (pump) => pump.equipmentId === equipment.equipmentId
    );
    if (schedule)
      return (
        <div className="flex flex-col my-auto ml-4 mr-12">
          <span className="mb-1">
            <TimeFive size="20" /> Start:{' '}
            {moment()
              .startOf('day')
              .add(schedule?.startTime, 'minutes')
              .format('HH:mm')}
          </span>
          <span className="mt-1">
            <TimeFive size="20" /> Stop:{' '}
            {moment()
              .startOf('day')
              .add(schedule?.endTime, 'minutes')
              .format('HH:mm')}
          </span>
        </div>
      );
  };
  return (
    <Link
      to={`/equipment/${equipment.equipmentId}`}
      className="w-full h-[10vh] inline-flex shadow-xl my-2 hover:scale-105 transition-transform hover:cursor-pointer"
    >
      <div
        className={`w-3 h-full ${
          equipment.isActive ? 'bg-emerald-500' : 'bg-red-500'
        }`}
      />
      <div className="flex flex-col ml-4 mr-8 mt-1 w-2/12">
        <span className="text-xl font-semibold">{equipment.equipmentName}</span>
        <span className="text-gray-500">{equipment.type}</span>
      </div>
      <div className="bg-neutral-300 h-16 my-auto w-16 mx-4">
        <img src={equipment.imageUrl} className="w-full h-full" />
      </div>
      <div className="h-4/5 w-[2px] bg-gray-200 mx-4 my-auto" />
      <div className="inline-flex h-full w-1/2 items-center justify-around text-sm">
        <div className="flex flex-col my-auto ml-4 mr-12">
          <span className="text-green-700 font-medium mb-1">
            <PriceTag3 size="20" /> ${equipment.cost}
          </span>
          <span className="mt-1">
            <Calendar size="20" /> Installed:{' '}
            {moment(equipment.installationDate).format('DD-MM-YYYY')}
          </span>
        </div>
        <div className="flex flex-col my-auto ml-4 mr-12">
          <span className="mb-1">
            <Activity size="20" /> Lifespan: {equipment.lifespan}
          </span>
          <span className="mt-1">
            <Calendar size="20" /> Replace:{' '}
            {moment(equipment.replacementPeriod).format('DD-MM-YYYY')}
          </span>
        </div>
        {renderSchedule()}
      </div>
    </Link>
  );
};

export default EquipmentCard;
