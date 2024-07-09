import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import useGetData from '@/hooks/useGetData';
import { Forms } from '@/layout/Forms';
import React, { useMemo, useState } from 'react';
import { Button } from "../../../components/forms/elements/button";


export const Checklist = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedMantent, setSelectedMantent] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const urls = ["tipoEquipos", "mantenimientos", "areas"];
  const { data, error, loading } = useGetData(urls);

  const filteredEquipment = useMemo(() => {
    if (!data.tipoEquipos) return [];
    if (!data.mantenimientos) return [];
    if (!data.areas) return [];
    return [
      { id: "desktop", name: "Desktop", location: "office", type: "desktop" },
      { id: "laptop", name: "Laptop", location: "office", type: "laptop" },
      { id: "monitor", name: "Monitor", location: "office", type: "monitor" },
      { id: "router", name: "Router", location: "remote", type: "networking" },
      { id: "switch", name: "Switch", location: "warehouse", type: "networking" },
      { id: "firewall", name: "Firewall", location: "remote", type: "networking" },
      { id: "web-server", name: "Web Server", location: "data-center", type: "server" },
      { id: "app-server", name: "Application Server", location: "data-center", type: "server" },
      { id: "db-server", name: "Database Server", location: "data-center", type: "server" },
      { id: "printer", name: "Printer", location: "office", type: "printer" },
    ].filter((item) => {
      if (selectedLocation === 'all' && selectedType === 'all') return true;
      if (selectedLocation === item.location && selectedType === 'all') return true;
      if (selectedLocation === 'all' && selectedType === item.type) return true;
      if (selectedLocation && item.location !== selectedLocation) return false;
      if (selectedType && item.type !== selectedType) return false;
      return true;
    });
  }, [selectedLocation, selectedType, selectedMantent, data.tipoEquipos, data.areas, data.mantenimientos]);

  const handleCheckboxChange = (event) => {
    const { id, checked } = event.target;
    setSelectedItems(prevSelectedItems => {
      if (checked) {
        return [...prevSelectedItems, id];
      } else {
        return prevSelectedItems.filter(itemId => itemId !== id);
      }
    });
    if (!checked) {
      setSelectAll(false);
    }
  };

  const handleSelectAllChange = (event) => {
    const checked = event.target.checked;
    setSelectAll(checked);
    setSelectedItems(checked ? filteredEquipment.map(item => item.id) : []);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Forms>
      <Card className="col-span-2 lg:col-span-1 ">
        <CardHeader>
          <CardTitle>Asignación de equipos para mantenimiento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
            <Label htmlFor="mantenimiento">Selecciona el mantenimiento</Label>
              <Select id="mantenimiento" value={selectedMantent} onValueChange={setSelectedMantent}>
                  <SelectTrigger>
                    <SelectValue placeholder="Mantenimiento" />
                  </SelectTrigger>
                  <SelectContent className="absolute bg-white border border-gray-300 rounded-md shadow-lg mt-1 z-10">
                    {data.mantenimientos.map(mant => (
                      <SelectItem key={mant.idMantenimiento} value={mant.idMantenimiento}>{mant.objetivo}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              <div className="grid gap-2 mt-3">
              <Label htmlFor="equipment">Filtra los equipos por:</Label>
                <Select id="equipment" value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Ubicacion" />
                  </SelectTrigger>
                  <SelectContent className="absolute bg-white border border-gray-300 rounded-md shadow-lg mt-1 z-10">
                    <SelectItem value="all">Todas las ubicaciones</SelectItem>
                    {data.areas.map(area => (
                      <SelectItem key={area.codigo} value={area.codigo}>{area.zona}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select id="equipment-type" value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo equipo" />
                  </SelectTrigger>
                  <SelectContent className="absolute bg-white border border-gray-300 rounded-md shadow-lg mt-1 z-10">
                    <SelectItem value="all">Todos los tipos</SelectItem>
                    {data.tipoEquipos.map(tipo => (
                      <SelectItem key={tipo.id} value={tipo.id}>{tipo.nombre}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2 mt-3">
              <Label>Selecciona los equipos para hacer el mantenimiento</Label>
              <div className="grid gap-2">
                <input type="checkbox" id="selectAll" checked={selectAll} onChange={handleSelectAllChange} />
                <label htmlFor="selectAll">Select All</label>
              </div>
              <div className="grid gap-2">
                {filteredEquipment.map((item) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <li key={item.id}>
                      <input type="checkbox" id={item.id} checked={selectedItems.includes(item.id)} onChange={handleCheckboxChange} />
                      <label htmlFor={item.id}>{item.name}</label>
                    </li>
                  </div>
                ))}
              </div>
              Selected items: {selectedItems.join(', ')}
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex items-center justify-center mt-6">
        <Button type={'submit'} name={'Enviar'} />
      </div>
    </Forms>
  );
};
