import axios from 'axios';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import NavBar from '../../components/NavBar';
import EquipmentType from '../../type/Equipment';

const EquipmentView = () => {
  const [equipment, setEquipment] = useState<EquipmentType>();
  const params = useParams();
  const id = params.equipmentId;

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/Equipment/EquipmentId/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((response) => {
        // console.log(response);
        setEquipment(response.data[0]);
      })
      .catch((err) => {
        console.log(err);
        toast.error('Error occured while getting the equipment information');
      });
  }, []);

  return (
    <>
      <NavBar />
      <div className="w-full grid grid-cols-2">
        <div className="text-4xl font-bold w-full h-[20vh] bg-[#BC8F8F] flex items-center px-12 col-span-2">
          Equipment
        </div>
        <div className="flex flex-col mt-24">
          <div className="mx-auto text-4xl font-bold underline">Equipment</div>
          <table className="mt-16 w-4/5 mx-auto">
            <tr className="bg-neutral-100 border-[2px] border-black">
              <th>Information</th>
            </tr>
            <tr className="border-[2px] border-black">
              <td className="flex flex-col px-6 py-4">
                <div>
                  <strong>Equipment name: </strong>
                  {equipment?.equipmentName}
                </div>
                <div>
                  <strong>Equipment Cost: </strong>${equipment?.cost}
                </div>
                <div>
                  <strong>Type: </strong>
                  {equipment?.type}
                </div>
                <div>
                  <strong>Installation Date: </strong>
                  {moment(equipment?.installationDate).format('DD-MM-YYYY')}
                </div>
                <div>
                  <strong>Guarantee Date: </strong>
                  {moment(equipment?.guaranteeDate).format('DD-MM-YYYY')}
                </div>
                <div>
                  <strong>Replacement: </strong>
                  {moment(equipment?.replacementPeriod).format('DD-MM-YYYY')}
                </div>
                <div>
                  <strong>Specification: </strong>
                  {equipment?.hardwareSpec}
                </div>
                <div>
                  <strong>Lifespan: </strong>
                  {equipment?.lifespan}
                </div>
                <div className="flex flex-col w-full">
                  <strong>Maintenances: </strong>
                  <div className="w-full rounded-lg border-2 overflow-clip">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2">
                          <th>Date</th>
                          <th>Summary</th>
                          <th>Details</th>
                          <th>Cost</th>
                        </tr>
                      </thead>
                      {equipment?.maintenance?.map((main, index) => (
                        <tr>
                          <td>
                            {moment(main.maintenanceDate).format(
                              'HH:mm:ss DD/MM/YY'
                            )}
                          </td>
                          <td>{main.maintenanceSummary}</td>
                          <td>{main.maintenanceDetails}</td>
                          <td>${main.maintenanceCost}</td>
                        </tr>
                      ))}
                    </table>
                  </div>
                </div>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </>
  );
};

export default EquipmentView;
