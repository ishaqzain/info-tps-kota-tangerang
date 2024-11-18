"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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
  const searchParams = useSearchParams();
  const router = useRouter();

  // Back to top
  const [showBackToTop, setShowBackToTop] = useState(false);

  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedKecamatan, setSelectedKecamatan] = useState("");
  const [selectedKelurahan, setSelectedKelurahan] = useState("");
  const [selectedTps, setSelectedTps] = useState("");

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle Back to top
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Load filter values from URL parameters
  useEffect(() => {
    setSearchTerm(searchParams.get("search") || "");
    setSelectedKecamatan(searchParams.get("kecamatan") || "");
    setSelectedKelurahan(searchParams.get("kelurahan") || "");
    setSelectedTps(searchParams.get("tps") || "");
  }, [searchParams]);

  // Update URL parameters when filters change
  const updateUrlParams = () => {
    const params = new URLSearchParams();

    if (searchTerm) params.set("search", searchTerm);
    if (selectedKecamatan) params.set("kecamatan", selectedKecamatan);
    if (selectedKelurahan) params.set("kelurahan", selectedKelurahan);
    if (selectedTps) params.set("tps", selectedTps);

    router.push(`?${params.toString()}`);
  };

  // Apply filter changes
  useEffect(() => {
    updateUrlParams();
  }, [searchTerm, selectedKecamatan, selectedKelurahan, selectedTps]);

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedKecamatan("");
    setSelectedKelurahan("");
    setSelectedTps("");
    router.push("/"); // Reset URL to base route
  };

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
              (tps) => tps.kecamatan.replace(/^\d+-/, "") === selectedKecamatan
            )
            .map((tps) => tps.kelurahan.replace(/^\d+-/, ""))
        )
      )
    : [];

  // Dapatkan daftar TPS unik berdasarkan kelurahan yang dipilih
  const tpsOptions = selectedKelurahan
    ? Array.from(
        new Set(
          tpsData
            .filter(
              (tps) => tps.kelurahan.replace(/^\d+-/, "") === selectedKelurahan
            )
            .map((tps) => tps.noTps.replace(/^\d+-/, ""))
        )
      )
    : [];

  // Filter data berdasarkan pencarian, kecamatan, kelurahan, dan TPS
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

    const matchesTps = selectedTps
      ? tps.noTps.replace(/^\d+-/, "") === selectedTps
      : true;

    return matchesSearch && matchesKecamatan && matchesKelurahan && matchesTps;
  });

  // Cek apakah filter aktif
  const isFilterActive =
    searchTerm || selectedKecamatan || selectedKelurahan || selectedTps;

  return (
    <div>
      {/* Toast */}
      <div
        id="sticky-banner"
        className="sticky top-0 start-0 z-50 flex justify-between w-full p-4 border-b border-blue-100 bg-blue-50 dark:bg-gray-700 dark:border-gray-600"
      >
        <div className="flex items-center mx-auto">
          <p className="flex items-center text-sm font-normal text-blue-500 dark:text-gray-400">
            <span className="inline-flex p-1 me-3 bg-blue-700 rounded-full dark:bg-gray-600 w-6 h-6 items-center justify-center flex-shrink-0">
              <svg
                className="w-3 h-3 text-white dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 18 19"
              >
                <path d="M15 1.943v12.114a1 1 0 0 1-1.581.814L8 11V5l5.419-3.871A1 1 0 0 1 15 1.943ZM7 4H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2v5a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2V4ZM4 17v-5h1v5H4ZM16 5.183v5.634a2.984 2.984 0 0 0 0-5.634Z" />
              </svg>
              <span className="sr-only">Light bulb</span>
            </span>
            <span className="text-blue-600 text-sm">
              Informasi alamat dan lokasi TPS belum 100% valid, mohon untuk
              dapat dikroscek kembali di masing-masing wilayah.
            </span>
          </p>
        </div>
      </div>
      <div className="min-h-screen p-3 bg-gray-50">
        <h1 className="text-3xl font-bold text-center mb-1 pt-5">
          Info TPS Kota Tangerang 2024
        </h1>
        <p className="text-xs text-center mb-6">Sumber: KPUD Kota Tangerang</p>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Cari berdasarkan kecamatan, kelurahan, alamat, atau TPS..."
          className="p-3 border border-gray-300 rounded w-full mb-2 shadow-sm focus:ring focus:ring-blue-300"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Filter Kecamatan */}
        <select
          className="p-3 border border-gray-300 rounded w-full mb-2 shadow-sm focus:ring focus:ring-blue-300"
          value={selectedKecamatan}
          onChange={(e) => {
            setSelectedKecamatan(e.target.value);
            setSelectedKelurahan("");
            setSelectedTps("");
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
          className="p-3 border border-gray-300 rounded w-full mb-2 shadow-sm focus:ring focus:ring-blue-300"
          value={selectedKelurahan}
          onChange={(e) => {
            setSelectedKelurahan(e.target.value);
            setSelectedTps("");
          }}
          disabled={!selectedKecamatan}
        >
          <option value="">Semua Kelurahan</option>
          {kelurahanOptions.map((kelurahan) => (
            <option key={kelurahan} value={kelurahan}>
              {kelurahan}
            </option>
          ))}
        </select>

        {/* Filter TPS */}
        <select
          className="p-3 border border-gray-300 rounded w-full mb-4 shadow-sm focus:ring focus:ring-blue-300"
          value={selectedTps}
          onChange={(e) => setSelectedTps(e.target.value)}
          disabled={!selectedKelurahan}
        >
          <option value="">Semua TPS</option>
          {tpsOptions.map((tps) => (
            <option key={tps} value={tps}>
              {tps}
            </option>
          ))}
        </select>

        {/* Reset Button (Tampilkan hanya jika filter aktif) */}
        {isFilterActive && (
          <button
            onClick={resetFilters}
            className="p-3 bg-red-500 text-white rounded shadow hover:bg-red-600 focus:ring focus:ring-red-300 mb-4"
          >
            Reset Filter
          </button>
        )}

        {/* Table */}
        <div className="overflow-x-auto h-[380px]">
          <table className="table-auto w-full border-collapse border border-gray-300 bg-white rounded shadow">
            <thead>
              <tr className="bg-blue-100 sticky top-0 z-10">
                <th className="border border-gray-300 p-3 text-center">No</th>
                <th className="border border-gray-300 p-3 text-left">
                  Kecamatan
                </th>
                <th className="border border-gray-300 p-3 text-left">
                  Kelurahan
                </th>
                <th className="border border-gray-300 p-3 text-left">No TPS</th>
                <th className="border border-gray-300 p-3 text-left">Alamat</th>
                <th className="border border-gray-300 p-3 text-left">Lokasi</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((tps, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="border border-gray-300 p-3 text-center">
                    {index + 1}
                  </td>
                  <td className="border border-gray-300 p-3">
                    {tps.kecamatan.replace(/^\d+-/, "")}
                  </td>
                  <td className="border border-gray-300 p-3">
                    {tps.kelurahan.replace(/^\d+-/, "")}
                  </td>
                  <td className="border border-gray-300 p-3 min-w-20">
                    {tps.noTps.replace(/^\d+-/, "")}
                  </td>
                  <td className="border border-gray-300 p-3 uppercase max-w-sm">
                    {tps.alamat}
                  </td>
                  <td className="border border-gray-300 p-3">
                    <a
                      href={`https://www.google.com/maps?q=${tps.lat},${tps.lon}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      Lihat Lokasi
                    </a>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="border border-gray-300 p-3 text-center text-gray-500"
                  >
                    Tidak ada data yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Back top top */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 focus:ring focus:ring-blue-300"
          aria-label="Back to Top"
        >
          ↑
        </button>
      )}
    </div>
  );
};

export default Home;
