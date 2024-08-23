import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import useGetData from '@/hooks/useGetData';
import { Forms } from '@/layout/Forms';
import React, { useMemo, useState } from 'react';
import { Button } from "../../../components/forms/elements/button";
import usePostData from '@/hooks/usePostData';
import { Divider } from '@mui/material';

export const Checklist = () => {
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedSubsede, setSelectedSubsede] = useState("all");
  const [selectedDependencia, setSelectedDependencia] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedMantent, setSelectedMantent] = useState({ idMantenimiento: "", objetivo: "" });
  const [selectAll, setSelectAll] = useState(false);
  const urls = ["tipoEquipos", "mantenimientos", "equipos", "subsedes", "dependencias"];
  const { data, error, loading } = useGetData(urls);
  console.log(data.equipos);

  const filteredEquipment = useMemo(() => {
    if (!data.equipos) return [];
    return data.equipos.filter((equipo) => {
      const subsedeMatches = selectedSubsede === 'all' || equipo.subsede.nombre === selectedSubsede;
      const typeMatches = selectedType === 'all' || equipo.tipoEquipo.nombre === selectedType;
      const dependenciaMatches = selectedDependencia === 'all' || equipo.dependencia.nombre === selectedDependencia;
      const searchMatches = equipo.serial.toLowerCase().includes(searchTerm.toLowerCase()) || equipo.tipoEquipo.nombre.toLowerCase().includes(searchTerm.toLowerCase());

      return subsedeMatches && typeMatches && dependenciaMatches && searchMatches;
    });
  }, [selectedSubsede, selectedType, selectedDependencia, searchTerm, data.equipos]);

  const filteredDependencias = useMemo(() => {
    if (selectedSubsede === 'all') return [];
    const subsede = data.subsedes.find(subsede => subsede.nombre === selectedSubsede);
    return subsede ? subsede.dependencias : [];
  }, [selectedSubsede, data.subsedes]);

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
    setSelectedItems(checked ? filteredEquipment.map(item => item.serial) : []);
  };

  const onSubmit = () => {
    setSelectedItems([]);
    setSelectedMantent({ idMantenimiento: "", objetivo: "" });
    setSelectAll(false);
  };

  const handleSubmit = usePostData(
    'mantenimientos/asociaEquipos',
    onSubmit,
    {
      idMantenimiento: selectedMantent.idMantenimiento,
      equipos: selectedItems.map(serial => ({ serial }))
    }
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Forms>
      <form onSubmit={handleSubmit}>
        <Card className="col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle>Asignación de equipos para mantenimiento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="mantenimiento">Selecciona el mantenimiento</Label>
                <Select id="mantenimiento" value={selectedMantent.objetivo} onValueChange={(value) => {
                  const selectedMant = data.mantenimientos.find(mant => mant.objetivo === value);
                  setSelectedMantent({ idMantenimiento: selectedMant.idMantenimiento, objetivo: selectedMant.objetivo });
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Mantenimiento" />
                  </SelectTrigger>
                  <SelectContent className="absolute bg-white border border-gray-300 rounded-md shadow-lg mt-1 z-10">
                    {data.mantenimientos
                      .filter(mant => mant.equipos.length === 0) // Filtra mantenimientos con equipos vacíos
                      .map(mant => (
                        <SelectItem key={mant.idMantenimiento} value={mant.objetivo || 'hola'}>
                          {mant.objetivo}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>

                <div className="grid gap-2 mt-3">
                  <Label htmlFor="subsede">Filtra los equipos por:</Label>
                  <Select id="subsede" value={selectedSubsede} onValueChange={setSelectedSubsede}>
                    <SelectTrigger>
                      <SelectValue placeholder="Ubicación" />
                    </SelectTrigger>
                    <SelectContent className="absolute bg-white border border-gray-300 rounded-md shadow-lg mt-1 z-10">
                      <SelectItem value="all">Todas las subsedes</SelectItem>
                      {data.subsedes.map(subsede => (
                        <SelectItem key={subsede.codigo} value={subsede.nombre}>{subsede.nombre || 'hola'}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {selectedSubsede !== "all" && (
                    <Select id="dependencia" value={selectedDependencia} onValueChange={setSelectedDependencia}>
                      <SelectTrigger>
                        <SelectValue placeholder="Dependencia" />
                      </SelectTrigger>
                      <SelectContent className="absolute bg-white border border-gray-300 rounded-md shadow-lg mt-1 z-10">
                        <SelectItem value="all">Todas las dependencias</SelectItem>
                        {filteredDependencias.map(dependencia => (
                          <SelectItem key={dependencia.idDependencia} value={dependencia.nombre}>{dependencia.nombre}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  <Select id="equipment-type" value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo equipo" />
                    </SelectTrigger>
                    <SelectContent className="absolute bg-white border-bg-gray-300 rounded-md shadow-lg mt-1 z-10">
                      <SelectItem value="all">Todos los tipos</SelectItem>
                      {data.tipoEquipos.map(tipo => (
                        <SelectItem key={tipo.id} value={tipo.nombre || 'hola'}>{tipo.nombre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {/* Buscador */}
              <div className="grid gap-2 mt-3">
                <Label htmlFor="search">Buscar equipo:</Label>
                <input
                  id="search"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por serial o tipo de equipo"
                  className="border border-gray-300 rounded-md p-2"
                />
              </div>

              <div className="grid gap-2 mt-3">
                <Label>Selecciona los equipos para hacer el mantenimiento:</Label>
                <div className="max-h-64 overflow-y-auto border border-gray-300 rounded-md p-2 mt-2">
                  <ul className="grid gap-2">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="selectAll" checked={selectAll} onChange={handleSelectAllChange} className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <label htmlFor="selectAll" className="ml-2 text-lg font-medium text-gray-700">Seleccionar todos</label>
                    </div>
                    <Divider />
                    {filteredEquipment.map((item) => (
                      <div key={item.serial} className="flex items-center gap-2">
                        <input type="checkbox" id={item.serial} checked={selectedItems.includes(item.serial)} onChange={handleCheckboxChange} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <label htmlFor={item.serial} className="ml-2 text-sm font-medium text-gray-700">{item.serial} - {item.tipoEquipo.nombre}</label>
                      </div>
                    ))}
                  </ul>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  Equipos seleccionados: {selectedItems.join(', ')}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="flex items-center justify-center mt-6">
          <Button type={'submit'} name={'Enviar'} />
        </div>
      </form>
    </Forms>
  );
};
