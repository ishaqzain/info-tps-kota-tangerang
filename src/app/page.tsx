"use client";

import { useState } from "react";
import tpsDataRaw from "./data/tps.json";

type Tps = {
  kecamatan: string;
  kelurahan: string;
  noTps: string;
  alamat: string;
  lat: string;
  lon: string;
};

const tpsData: Tps[] = tpsDataRaw;

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedKecamatan, setSelectedKecamatan] = useState("");
  const [selectedKelurahan, setSelectedKelurahan] = useState("");

  // Dapatkan daftar kecamatan unik
  const kecamatanOptions = Array.from(
    new Set(tpsData.map((tps) => tps.kecamatan.replace(/^\d+-/, "")))
  );

  // Dapatkan daftar kelurahan unik berdasarkan kecamatan yang dipilih
  const kelurahanOptions = selectedKecamatan
    ? Array.from(
        new Set(
          tpsData
            .filter(
              (tps) =>
                tps.kecamatan.replace(/^\d+-/, "") === selectedKecamatan
            )
            .map((tps) => tps.kelurahan.replace(/^\d+-/, ""))
        )
      )
    : [];

  // Filter data berdasarkan pencarian, kecamatan, dan kelurahan
  const filteredData = tpsData.filter((tps) => {
    const matchesSearch =
      tps.kecamatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tps.kelurahan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tps.noTps.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tps.alamat.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesKecamatan = selectedKecamatan
      ? tps.kecamatan.replace(/^\d+-/, "") === selectedKecamatan
      : true;

    const matchesKelurahan = selectedKelurahan
      ? tps.kelurahan.replace(/^\d+-/, "") === selectedKelurahan
      : true;

    return matchesSearch && matchesKecamatan && matchesKelurahan;
  });

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold text-center mb-6">Info TPS Kota Tangerang 2024</h1>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Cari berdasarkan kecamatan, kelurahan, alamat, atau TPS..."
        className="p-3 border border-gray-300 rounded w-full mb-4 shadow-sm focus:ring focus:ring-blue-300"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Filter Kecamatan */}
      <select
        className="p-3 border border-gray-300 rounded w-full mb-4 shadow-sm focus:ring focus:ring-blue-300"
        value={selectedKecamatan}
        onChange={(e) => {
          setSelectedKecamatan(e.target.value);
          setSelectedKelurahan(""); // Reset kelurahan jika kecamatan berubah
        }}
      >
        <option value="">Semua Kecamatan</option>
        {kecamatanOptions.map((kecamatan) => (
          <option key={kecamatan} value={kecamatan}>
            {kecamatan}
          </option>
        ))}
      </select>

      {/* Filter Kelurahan */}
      <select
        className="p-3 border border-gray-300 rounded w-full mb-4 shadow-sm focus:ring focus:ring-blue-300"
        value={selectedKelurahan}
        onChange={(e) => setSelectedKelurahan(e.target.value)}
        disabled={!selectedKecamatan} // Disable jika kecamatan belum dipilih
      >
        <option value="">Semua Kelurahan</option>
        {kelurahanOptions.map((kelurahan) => (
          <option key={kelurahan} value={kelurahan}>
            {kelurahan}
          </option>
        ))}
      </select>

      {/* Table */}
      <table className="w-full border-collapse border border-gray-300 bg-white rounded shadow">
        <thead>
          <tr className="bg-blue-100">
            <th className="border border-gray-300 p-3 text-center">No</th>
            <th className="border border-gray-300 p-3 text-left">Kecamatan</th>
            <th className="border border-gray-300 p-3 text-left">Kelurahan</th>
            <th className="border border-gray-300 p-3 text-left">No TPS</th>
            <th className="border border-gray-300 p-3 text-left">Alamat</th>
            <th className="border border-gray-300 p-3 text-left">Lokasi</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((tps, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="border border-gray-300 p-3">{index + 1}</td>
              <td className="border border-gray-300 p-3">
                {tps.kecamatan.replace(/^\d+-/, "")}
              </td>
              <td className="border border-gray-300 p-3">
                {tps.kelurahan.replace(/^\d+-/, "")}
              </td>
              <td className="border border-gray-300 p-3">
                {tps.noTps.replace(/^\d+-/, "")}
              </td>
              <td className="border border-gray-300 p-3 uppercase">{tps.alamat}</td>
              <td className="border border-gray-300 p-3">
                <a
                  href={`https://www.google.com/maps?q=${tps.lat},${tps.lon}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline hover:text-blue-700"
                >
                  Lihat
                </a>
              </td>
            </tr>
          ))}
          {filteredData.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center p-4 text-gray-500">
                Tidak ada data yang ditemukan.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Home;
