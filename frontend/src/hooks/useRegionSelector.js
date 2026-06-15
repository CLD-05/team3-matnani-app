import { useEffect, useState } from "react";
import { fetchCities, fetchChildren } from "../api/regions";

export function useRegionSelector() {
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [dongs, setDongs] = useState([]);

  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedDong, setSelectedDong] = useState(null);

  useEffect(() => {
    fetchCities().then(setCities).catch(() => {});
  }, []);

  const selectCity = async (city) => {
    setSelectedCity(city);
    setSelectedDistrict(null);
    setSelectedDong(null);
    setDistricts([]);
    setDongs([]);
    const children = await fetchChildren(city.id);
    setDistricts(children);
  };

  const selectDistrict = async (district) => {
    setSelectedDistrict(district);
    setSelectedDong(null);
    setDongs([]);
    const children = await fetchChildren(district.id);
    setDongs(children);
  };

  const selectDong = (dong) => {
    setSelectedDong(dong);
  };

  const reset = () => {
    setSelectedCity(null);
    setSelectedDistrict(null);
    setSelectedDong(null);
    setDistricts([]);
    setDongs([]);
  };

  const selectedRegion = selectedDong
    ? {
        id: selectedDong.id,
        name: selectedDong.name,
        label: `${selectedCity?.name} ${selectedDistrict?.name} ${selectedDong.name}`,
      }
    : null;

  return {
    cities,
    districts,
    dongs,
    selectedCity,
    selectedDistrict,
    selectedDong,
    selectedRegion,
    selectCity,
    selectDistrict,
    selectDong,
    reset,
  };
}
