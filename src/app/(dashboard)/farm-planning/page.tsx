"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { DashboardShell } from "@/components/dashboard/shell";
import { useAuth } from "@/lib/use-auth";
import {
  getPlannedCrops,
  addPlannedCrop,
  deletePlannedCrop,
  getFarmTasks,
  addFarmTask,
  toggleFarmTask,
  deleteFarmTask,
} from "@/lib/db";
import {
  ClipboardList,
  Calendar as CalendarIcon,
  CheckSquare,
  Plus,
  TrendingUp,
  Sprout,
  Coins,
  Clock,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Lightbulb,
  ArrowRight,
  Tractor,
  Droplet,
  FlaskConical,
  Bug,
  Wheat,
  Check,
  X,
  Loader2,
  Trash2,
} from "lucide-react";

type PlanTab = "plan" | "calendar" | "tasks";
type TaskFilter = "all" | "today" | "upcoming" | "completed";

interface PlannedCrop {
  id: string;
  name: string;
  variety: string;
  area: string;
  sowingDate: string;
  harvestDate: string;
  expectedYield: string;
}

interface FarmTask {
  id: string;
  name: string;
  field: string;
  date: string;
  status: "Upcoming" | "Pending" | "Scheduled" | "Completed";
  type: "tractor" | "sowing" | "irrigation" | "fertilizer" | "weed" | "harvest";
}

const INITIAL_CROPS: PlannedCrop[] = [
  {
    id: "1",
    name: "Rice",
    variety: "Pusa Basmati 1509",
    area: "2.00 acre",
    sowingDate: "20 Jun 2024",
    harvestDate: "20 Oct 2024",
    expectedYield: "28 Quintal",
  },
  {
    id: "2",
    name: "Soybean",
    variety: "JS 335",
    area: "1.70 acre",
    sowingDate: "25 Jun 2024",
    harvestDate: "10 Oct 2024",
    expectedYield: "18 Quintal",
  },
  {
    id: "3",
    name: "Arhar (Tur)",
    variety: "Maruti",
    area: "1.50 acre",
    sowingDate: "15 Jun 2024",
    harvestDate: "15 Nov 2024",
    expectedYield: "12 Quintal",
  },
];

const INITIAL_TASKS: FarmTask[] = [
  {
    id: "t1",
    name: "Land Preparation for Rice",
    field: "Field 1 (2.00 acre)",
    date: "18 Jun 2024",
    status: "Upcoming",
    type: "tractor",
  },
  {
    id: "t2",
    name: "Sowing - Rice",
    field: "Field 1 (2.00 acre)",
    date: "20 Jun 2024",
    status: "Upcoming",
    type: "sowing",
  },
  {
    id: "t3",
    name: "Irrigation - Rice",
    field: "Field 1 (2.00 acre)",
    date: "25 Jun 2024",
    status: "Upcoming",
    type: "irrigation",
  },
  {
    id: "t4",
    name: "Fertilizer - Rice (1st Dose)",
    field: "Field 1 (2.00 acre)",
    date: "05 Jul 2024",
    status: "Pending",
    type: "fertilizer",
  },
  {
    id: "t5",
    name: "Weed Control - Rice",
    field: "Field 1 (2.00 acre)",
    date: "10 Jul 2024",
    status: "Pending",
    type: "weed",
  },
  {
    id: "t6",
    name: "Harvesting - Rice",
    field: "Field 1 (2.00 acre)",
    date: "20 Oct 2024",
    status: "Scheduled",
    type: "harvest",
  },
];

function CropIconSvg({ name }: { name: string }) {
  if (name.includes("Rice")) {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-[#16a34a]">
        <span className="text-sm">🌾</span>
      </div>
    );
  }
  if (name.includes("Soybean")) {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-lime-100 text-lime-700">
        <span className="text-sm">🌱</span>
      </div>
    );
  }
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
      <span className="text-sm">🌿</span>
    </div>
  );
}

function TaskTypeIcon({ type }: { type: FarmTask["type"] }) {
  switch (type) {
    case "tractor":
      return <Tractor className="h-4.5 w-4.5 text-[#16a34a]" />;
    case "sowing":
      return <Sprout className="h-4.5 w-4.5 text-[#16a34a]" />;
    case "irrigation":
      return <Droplet className="h-4.5 w-4.5 text-blue-500" />;
    case "fertilizer":
      return <FlaskConical className="h-4.5 w-4.5 text-amber-500" />;
    case "weed":
      return <Bug className="h-4.5 w-4.5 text-emerald-600" />;
    case "harvest":
      return <Wheat className="h-4.5 w-4.5 text-purple-600" />;
    default:
      return <CheckSquare className="h-4.5 w-4.5 text-primary" />;
  }
}

export default function FarmPlanningPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<PlanTab>("plan");
  const [taskFilter, setTaskFilter] = useState<TaskFilter>("all");
  const [tasks, setTasks] = useState<FarmTask[]>(INITIAL_TASKS);
  const [crops, setCrops] = useState<PlannedCrop[]>(INITIAL_CROPS);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Create Plan Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCropName, setNewCropName] = useState("");
  const [newVariety, setNewVariety] = useState("");
  const [newArea, setNewArea] = useState("");
  const [newSowing, setNewSowing] = useState("");
  const [newHarvest, setNewHarvest] = useState("");
  const [newYield, setNewYield] = useState("");
  const [isSavingCrop, setIsSavingCrop] = useState(false);

  // Task Details Modal
  const [selectedTask, setSelectedTask] = useState<FarmTask | null>(null);

  // Month navigation in Crop Calendar
  const [selectedMonth, setSelectedMonth] = useState("June 2024");

  // Load from InsForge DB on mount / user change
  useEffect(() => {
    async function loadFarmData() {
      if (!user?.id) return;
      setIsLoadingData(true);
      try {
        const [dbCrops, dbTasks] = await Promise.all([
          getPlannedCrops(user.id),
          getFarmTasks(user.id),
        ]);

        if (dbCrops && dbCrops.length > 0) {
          setCrops(
            dbCrops.map((c) => ({
              id: c.id || String(Date.now()),
              name: c.name,
              variety: c.variety || "Standard Variety",
              area: `${c.area_acres} acre`,
              sowingDate: c.sowing_date,
              harvestDate: c.harvest_date,
              expectedYield: `${c.expected_yield_quintal || 20} Quintal`,
            })),
          );
        }

        if (dbTasks && dbTasks.length > 0) {
          setTasks(
            dbTasks.map((t) => ({
              id: t.id || `t-${Date.now()}`,
              name: t.title,
              field: t.description || "Main Farm Field",
              date: t.due_date,
              status: t.completed ? "Completed" : "Upcoming",
              type: (t.category as FarmTask["type"]) || "tractor",
            })),
          );
        }
      } catch (err) {
        console.error("Failed to load farm planning data from DB:", err);
      } finally {
        setIsLoadingData(false);
      }
    }
    loadFarmData();
  }, [user]);

  async function handleCreatePlan() {
    if (!newCropName || !newArea) {
      toast.error("Please fill in crop name and area");
      return;
    }

    setIsSavingCrop(true);
    try {
      const areaNum = parseFloat(newArea) || 2.0;
      const yieldNum = parseFloat(newYield) || 25;
      const sowingDateStr = newSowing || "01 Jul 2024";
      const harvestDateStr = newHarvest || "15 Nov 2024";

      let createdId = String(Date.now());
      if (user?.id) {
        const savedCrop = await addPlannedCrop({
          user_id: user.id,
          name: newCropName,
          variety: newVariety || "Standard Hybrid",
          area_acres: areaNum,
          sowing_date: sowingDateStr,
          harvest_date: harvestDateStr,
          expected_yield_quintal: yieldNum,
          status: "Planned",
        });
        if (savedCrop?.id) createdId = savedCrop.id;

        // Auto-generate 5 structured crop calendar tasks for this crop
        const autoTasks: Array<{ title: string; category: any; due_date: string; description: string }> = [
          {
            title: `Land Preparation for ${newCropName}`,
            category: "soil",
            due_date: "10 Jun 2024",
            description: `Primary tillage and FYM application for ${newCropName} field (${areaNum} acre).`,
          },
          {
            title: `Seed Treatment & Sowing - ${newCropName}`,
            category: "sowing",
            due_date: sowingDateStr,
            description: `Treat seeds with biofungicide and sow in field parcel (${areaNum} acre).`,
          },
          {
            title: `1st Irrigation & Interculture - ${newCropName}`,
            category: "irrigation",
            due_date: "15 Jul 2024",
            description: `Scheduled irrigation and intercultural weeding.`,
          },
          {
            title: `Top-Dressing Fertilizer Dose - ${newCropName}`,
            category: "fertilizer",
            due_date: "05 Aug 2024",
            description: `Apply split dose of Urea and Potash as per crop schedule.`,
          },
          {
            title: `Harvesting & Threshing - ${newCropName}`,
            category: "harvest",
            due_date: harvestDateStr,
            description: `Harvest standing crop when grain moisture reaches ~14%.`,
          },
        ];

        for (const at of autoTasks) {
          try {
            await addFarmTask({
              user_id: user.id,
              crop_id: createdId,
              title: at.title,
              description: at.description,
              category: at.category,
              due_date: at.due_date,
              completed: false,
            });
          } catch {
            // Ignore single task insert errors
          }
        }

        // Refresh tasks from DB
        const updatedTasks = await getFarmTasks(user.id);
        if (updatedTasks) {
          setTasks(
            updatedTasks.map((t) => ({
              id: t.id || `t-${Date.now()}`,
              name: t.title,
              field: t.description || "Main Field",
              date: t.due_date,
              status: t.completed ? "Completed" : "Upcoming",
              type: (t.category as FarmTask["type"]) || "tractor",
            })),
          );
        }
      }

      const createdCrop: PlannedCrop = {
        id: createdId,
        name: newCropName,
        variety: newVariety || "Standard Hybrid",
        area: `${areaNum} acre`,
        sowingDate: sowingDateStr,
        harvestDate: harvestDateStr,
        expectedYield: `${yieldNum} Quintal`,
      };

      setCrops((prev) => [createdCrop, ...prev]);
      setShowCreateModal(false);
      setNewCropName("");
      setNewVariety("");
      setNewArea("");
      setNewSowing("");
      setNewHarvest("");
      setNewYield("");
      toast.success(`Added ${newCropName} and generated farming task schedule!`);
    } catch (err) {
      console.error("Failed to create planned crop:", err);
      toast.error("Failed to save planned crop.");
    } finally {
      setIsSavingCrop(false);
    }
  }

  async function handleToggleTask(taskId: string) {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const nextCompleted = task.status !== "Completed";
    const nextStatus = nextCompleted ? "Completed" : "Upcoming";

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: nextStatus } : t)),
    );

    if (user?.id) {
      try {
        await toggleFarmTask(taskId, nextCompleted);
      } catch (err) {
        console.error("Failed to update task in DB:", err);
      }
    }

    toast.success(
      nextCompleted
        ? `Task "${task.name}" marked as completed!`
        : `Task "${task.name}" marked as upcoming.`,
    );
  }

  async function handleDeleteCrop(cropId: string) {
    setCrops((prev) => prev.filter((c) => c.id !== cropId));
    if (user?.id) {
      try {
        await deletePlannedCrop(cropId, user.id);
      } catch (err) {
        console.error("Failed to delete crop in DB:", err);
      }
    }
    toast.success("Crop removed from farm plan.");
  }

  const filteredTasks = tasks.filter((t) => {
    if (taskFilter === "all") return true;
    if (taskFilter === "today") return t.date.toLowerCase().includes("jun") || t.date.toLowerCase().includes("today");
    if (taskFilter === "upcoming") return t.status === "Upcoming" || t.status === "Pending" || t.status === "Scheduled";
    if (taskFilter === "completed") return t.status === "Completed";
    return true;
  });

  return (
    <DashboardShell
      headerTitle="Farm Planning 🌱"
      headerSubtitle="Plan your farm, follow calendar and complete tasks easily."
    >
      <div className="space-y-6 pb-8">
        {/* ======================================================== */}
        {/* 1. THREE BOXED PAGE TABS                                 */}
        {/* ======================================================== */}
        <div className="grid grid-cols-3 gap-3">
          {/* Tab 1: Farming Plan */}
          <button
            type="button"
            onClick={() => setActiveTab("plan")}
            className={`flex items-center justify-center gap-2 rounded-xl py-3 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "plan"
                ? "border-2 border-[#168447] bg-[#eaf7ee] text-[#168447] shadow-2xs"
                : "border border-border/80 bg-card text-foreground hover:bg-muted/40"
            }`}
          >
            <ClipboardList className="h-4.5 w-4.5 text-[#168447]" />
            <span>Farming Plan</span>
          </button>

          {/* Tab 2: Crop Calendar */}
          <button
            type="button"
            onClick={() => setActiveTab("calendar")}
            className={`flex items-center justify-center gap-2 rounded-xl py-3 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "calendar"
                ? "border-2 border-[#168447] bg-[#eaf7ee] text-[#168447] shadow-2xs"
                : "border border-border/80 bg-card text-foreground hover:bg-muted/40"
            }`}
          >
            <CalendarIcon className="h-4.5 w-4.5" />
            <span>Crop Calendar</span>
          </button>

          {/* Tab 3: Farming Tasks */}
          <button
            type="button"
            onClick={() => setActiveTab("tasks")}
            className={`flex items-center justify-center gap-2 rounded-xl py-3 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "tasks"
                ? "border-2 border-[#168447] bg-[#eaf7ee] text-[#168447] shadow-2xs"
                : "border border-border/80 bg-card text-foreground hover:bg-muted/40"
            }`}
          >
            <CheckSquare className="h-4.5 w-4.5" />
            <span>Farming Tasks</span>
          </button>
        </div>

        {/* ======================================================== */}
        {/* 2. CARD 1: MY FARMING PLAN                               */}
        {/* ======================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs"
        >
          {/* Header */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-5 border-b border-border/60">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
                <ClipboardList className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-display text-base font-bold tracking-tight text-foreground">
                  My Farming Plan
                </h2>
                <p className="text-xs text-muted-foreground">
                  Overview of your current farming plan
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#168447]/40 bg-card px-4 py-2 text-xs font-bold text-[#168447] shadow-2xs hover:bg-[#edf8f1] transition-colors cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create New Plan</span>
            </button>
          </div>

          {/* 5 Summary Metric Cards in 1 Row */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {/* Card 1: Total Land */}
            <div className="flex items-center gap-3 rounded-xl border border-emerald-200/70 bg-[#f0fdf4] p-3.5 shadow-2xs dark:bg-emerald-950/20">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-[#168447]">
                <Sprout className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="block text-[10px] text-muted-foreground font-medium">
                  Total Land
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-base font-black text-foreground">
                    5.20
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    acres
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2: Crops */}
            <div className="flex items-center gap-3 rounded-xl border border-emerald-200/70 bg-[#f0fdf4] p-3.5 shadow-2xs dark:bg-emerald-950/20">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-[#168447]">
                <Sprout className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="block text-[10px] text-muted-foreground font-medium">
                  Crops
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-base font-black text-foreground">
                    3
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    crops
                  </span>
                </div>
              </div>
            </div>

            {/* Card 3: Estimated Investment */}
            <div className="flex items-center gap-3 rounded-xl border border-lime-200/70 bg-[#f7fee7] p-3.5 shadow-2xs dark:bg-lime-950/20">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-lime-100 text-lime-700">
                <Coins className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="block text-[10px] text-muted-foreground font-medium">
                  Est. Investment
                </span>
                <span className="font-display text-base font-black text-foreground">
                  ₹78,450
                </span>
              </div>
            </div>

            {/* Card 4: Estimated Profit */}
            <div className="flex items-center gap-3 rounded-xl border border-emerald-200/70 bg-[#ecfdf5] p-3.5 shadow-2xs dark:bg-emerald-950/20">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-[#16a34a]">
                <TrendingUp className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="block text-[10px] text-muted-foreground font-medium">
                  Est. Profit
                </span>
                <span className="font-display text-base font-black text-[#16a34a]">
                  ₹1,45,300
                </span>
              </div>
            </div>

            {/* Card 5: Plan Duration */}
            <div className="flex items-center gap-3 rounded-xl border border-blue-200/70 bg-[#eff6ff] p-3.5 shadow-2xs dark:bg-blue-950/20">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <CalendarIcon className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="block text-[10px] text-muted-foreground font-medium">
                  Plan Duration
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-base font-black text-foreground">
                    120
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    days
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Planned Crops Table */}
          <div className="mt-6">
            <h3 className="font-display text-sm font-bold text-foreground mb-3">
              Planned Crops
            </h3>

            <div className="overflow-x-auto rounded-xl border border-border/80">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border/80 bg-muted/40 text-[11px] text-muted-foreground">
                    <th className="py-2.5 px-4 text-left font-bold">Crop</th>
                    <th className="py-2.5 px-4 text-left font-bold">Variety</th>
                    <th className="py-2.5 px-4 text-left font-bold">Area</th>
                    <th className="py-2.5 px-4 text-left font-bold">
                      Sowing Date
                    </th>
                    <th className="py-2.5 px-4 text-left font-bold">
                      Harvest Date
                    </th>
                    <th className="py-2.5 px-4 text-left font-bold">
                      Expected Yield
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 font-medium">
                  {crops.map((crop) => (
                    <tr key={crop.id} className="hover:bg-muted/20">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <CropIconSvg name={crop.name} />
                          <span className="font-bold text-foreground">
                            {crop.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {crop.variety}
                      </td>
                      <td className="py-3 px-4 font-semibold text-foreground">
                        {crop.area}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {crop.sowingDate}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {crop.harvestDate}
                      </td>
                      <td className="py-3 px-4 font-bold text-foreground">
                        {crop.expectedYield}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Information Strip */}
          <div className="mt-5 flex flex-col gap-2 rounded-xl border border-[#d1f0dc] bg-[#edf8f1] px-4 py-2.5 text-xs text-[#166534] sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 shrink-0 text-amber-500" />
              <span className="font-medium">
                Tip: Follow the crop calendar and complete tasks on time for
                better yield.
              </span>
            </div>

            <button
              type="button"
              onClick={() => toast.info("Opening Full Farm Plan Editor")}
              className="inline-flex items-center gap-1 rounded-lg bg-[#168447] px-3.5 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-[#14743e] cursor-pointer"
            >
              <span>View / Edit Plan</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </motion.div>

        {/* ======================================================== */}
        {/* 3. CARD 2: CROP CALENDAR SECTION                         */}
        {/* ======================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs"
        >
          {/* Header */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-5 border-b border-border/60">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[#168447] border border-emerald-200">
                <CalendarIcon className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-display text-base font-bold tracking-tight text-foreground">
                  Crop Calendar
                </h2>
                <p className="text-xs text-muted-foreground">
                  Key farming activities by month
                </p>
              </div>
            </div>

            {/* Month Navigation */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setSelectedMonth("May 2024")}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/80 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-1 rounded-lg border border-border/80 bg-background px-3 py-1 text-xs font-bold text-foreground">
                <span>{selectedMonth}</span>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground ml-1" />
              </div>
              <button
                type="button"
                onClick={() => setSelectedMonth("July 2024")}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/80 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Calendar Grid + Right Crops in Plan */}
          <div className="mt-6 grid gap-6 lg:grid-cols-12">
            {/* Left Gantt Timeline Table (9 cols) */}
            <div className="overflow-x-auto lg:col-span-9">
              <div className="min-w-[500px]">
                {/* Months Header */}
                <div className="grid grid-cols-8 text-center text-xs font-bold text-muted-foreground pb-2 border-b border-border/80">
                  <div className="text-left font-bold text-foreground">
                    Activity
                  </div>
                  <div>Jun</div>
                  <div>Jul</div>
                  <div>Aug</div>
                  <div>Sep</div>
                  <div>Oct</div>
                  <div>Nov</div>
                  <div>Dec</div>
                </div>

                {/* Rows with colored timeline spans */}
                <div className="divide-y divide-border/40 text-xs py-2">
                  {/* 1. Land Preparation */}
                  <div className="grid grid-cols-8 items-center py-2.5">
                    <div className="flex items-center gap-2 font-bold text-foreground">
                      <Tractor className="h-4 w-4 text-[#16a34a]" />
                      <span>Land Preparation</span>
                    </div>
                    <div className="col-span-1 px-1">
                      <div className="h-5 rounded-full bg-[#86efac]" />
                    </div>
                    <div className="col-span-6" />
                  </div>

                  {/* 2. Sowing */}
                  <div className="grid grid-cols-8 items-center py-2.5">
                    <div className="flex items-center gap-2 font-bold text-foreground">
                      <Sprout className="h-4 w-4 text-[#16a34a]" />
                      <span>Sowing</span>
                    </div>
                    <div className="col-span-1" />
                    <div className="col-span-2 px-1">
                      <div className="h-5 rounded-full bg-[#86efac]" />
                    </div>
                    <div className="col-span-4" />
                  </div>

                  {/* 3. Irrigation */}
                  <div className="grid grid-cols-8 items-center py-2.5">
                    <div className="flex items-center gap-2 font-bold text-foreground">
                      <Droplet className="h-4 w-4 text-blue-500" />
                      <span>Irrigation</span>
                    </div>
                    <div className="col-span-2" />
                    <div className="col-span-2 px-1">
                      <div className="h-5 rounded-full bg-[#93c5fd]" />
                    </div>
                    <div className="col-span-3" />
                  </div>

                  {/* 4. Fertilizer */}
                  <div className="grid grid-cols-8 items-center py-2.5">
                    <div className="flex items-center gap-2 font-bold text-foreground">
                      <FlaskConical className="h-4 w-4 text-amber-500" />
                      <span>Fertilizer</span>
                    </div>
                    <div className="col-span-2" />
                    <div className="col-span-3 px-1">
                      <div className="h-5 rounded-full bg-[#fde047]" />
                    </div>
                    <div className="col-span-2" />
                  </div>

                  {/* 5. Pest Control */}
                  <div className="grid grid-cols-8 items-center py-2.5">
                    <div className="flex items-center gap-2 font-bold text-foreground">
                      <Bug className="h-4 w-4 text-rose-500" />
                      <span>Pest Control</span>
                    </div>
                    <div className="col-span-3" />
                    <div className="col-span-3 px-1">
                      <div className="h-5 rounded-full bg-[#fca5a5]" />
                    </div>
                    <div className="col-span-1" />
                  </div>

                  {/* 6. Harvesting */}
                  <div className="grid grid-cols-8 items-center py-2.5">
                    <div className="flex items-center gap-2 font-bold text-foreground">
                      <Wheat className="h-4 w-4 text-purple-600" />
                      <span>Harvesting</span>
                    </div>
                    <div className="col-span-5" />
                    <div className="col-span-2 px-1">
                      <div className="h-5 rounded-full bg-[#d8b4fe]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Crops Legend & Simple Guide (3 cols) */}
            <div className="space-y-4 lg:col-span-3">
              {/* Crops in Plan */}
              <div className="rounded-xl border border-border/80 bg-slate-50/70 p-3.5 dark:bg-muted/10">
                <h4 className="text-xs font-bold text-foreground mb-2.5">
                  Crops in Plan
                </h4>
                <div className="space-y-1.5 text-xs text-foreground">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#16a34a]" />
                    <span>Rice</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-blue-500" />
                    <span>Soybean</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    <span>Arhar (Tur)</span>
                  </div>
                </div>
              </div>

              {/* Simple Guide Card */}
              <div className="rounded-xl border border-emerald-200/80 bg-[#eaf7ee] p-3.5 dark:bg-emerald-950/20">
                <div className="flex items-center gap-2 text-[#168447] font-bold text-xs">
                  <Sprout className="h-4 w-4" />
                  <span>Simple Guide</span>
                </div>
                <p className="mt-1 text-[11px] text-[#166534] dark:text-emerald-300">
                  Do the right work at the right time.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ======================================================== */}
        {/* 4. CARD 3: FARMING TASKS SECTION                         */}
        {/* ======================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs"
        >
          {/* Header & Filter Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-5 border-b border-border/60">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[#168447] border border-emerald-200">
                <CheckSquare className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-display text-base font-bold tracking-tight text-foreground">
                  Farming Tasks
                </h2>
                <p className="text-xs text-muted-foreground">
                  Your daily and upcoming tasks
                </p>
              </div>
            </div>

            {/* Task Filters */}
            <div className="flex items-center gap-1.5 text-xs font-semibold">
              {(["all", "today", "upcoming", "completed"] as TaskFilter[]).map(
                (flt) => (
                  <button
                    key={flt}
                    type="button"
                    onClick={() => setTaskFilter(flt)}
                    className={`rounded-lg px-3 py-1.5 capitalize transition-colors cursor-pointer ${
                      taskFilter === flt
                        ? "bg-[#168447] text-white shadow-2xs font-bold"
                        : "border border-border/80 bg-card text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {flt}
                  </button>
                ),
              )}
            </div>
          </div>

          {/* Tasks List */}
          <div className="mt-4 divide-y divide-border/60">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="flex flex-col gap-3 py-3.5 sm:flex-row sm:items-center sm:justify-between"
              >
                {/* Left: Icon + Title & Field */}
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted/40">
                    <TaskTypeIcon type={task.type} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">
                      {task.name}
                    </h4>
                    <p className="text-[10px] text-muted-foreground">
                      {task.field}
                    </p>
                  </div>
                </div>

                {/* Right: Date + Status Badge + View Button */}
                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <CalendarIcon className="h-3.5 w-3.5" />
                    <span>{task.date}</span>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      task.status === "Upcoming"
                        ? "bg-[#fef9c3] text-[#ca8a04]"
                        : task.status === "Pending"
                          ? "bg-[#dbeafe] text-[#2563eb]"
                          : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {task.status}
                  </span>

                  {/* View Button */}
                  <button
                    type="button"
                    onClick={() => setSelectedTask(task)}
                    className="rounded-lg border border-[#168447]/40 bg-card px-3 py-1 text-xs font-bold text-[#168447] shadow-2xs hover:bg-[#edf8f1] transition-colors cursor-pointer"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Centered View All Tasks Button */}
          <div className="mt-6 flex justify-center pt-2 border-t border-border/40">
            <button
              type="button"
              onClick={() =>
                toast.info("Displaying all 24 scheduled farm tasks")
              }
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#168447]/40 bg-card px-5 py-2 text-xs font-bold text-[#168447] shadow-2xs hover:bg-[#edf8f1] transition-colors cursor-pointer"
            >
              <span>View All Tasks</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </motion.div>

        {/* ======================================================== */}
        {/* 5. BOTTOM FULL-WIDTH FARMING BANNER                      */}
        {/* ======================================================== */}
        <div className="flex flex-col gap-3 rounded-2xl border border-[#d1ebd7] bg-gradient-to-r from-[#eef7ef] via-[#f4faf4] to-[#e8f5ec] p-4 sm:flex-row sm:items-center sm:justify-between shadow-xs">
          <div className="flex items-center gap-2 text-xs text-[#166534] font-medium">
            <Sprout className="h-4 w-4 shrink-0 text-[#168447]" />
            <span>
              Plan well, work on time and your farm will always shine!
            </span>
          </div>

          {/* Subtle Agricultural SVG Illustration */}
          <div className="flex items-center justify-end pr-2 opacity-80">
            <svg viewBox="0 0 160 36" className="h-9 w-40">
              {/* Tractor */}
              <g transform="translate(10, 8) scale(0.6)">
                <circle cx="12" cy="24" r="8" fill="#1e293b" />
                <circle cx="12" cy="24" r="4" fill="#e2e8f0" />
                <circle cx="34" cy="26" r="6" fill="#1e293b" />
                <circle cx="34" cy="26" r="3" fill="#e2e8f0" />
                <path
                  d="M 6 22 L 20 22 L 24 10 L 36 10 L 38 24"
                  fill="#16a34a"
                />
                <rect
                  x="22"
                  y="6"
                  width="10"
                  height="6"
                  fill="#38bdf8"
                  rx="1"
                />
                <rect x="14" y="2" width="2" height="10" fill="#475569" />
              </g>
              {/* Crops & Trees */}
              <g transform="translate(60, 10)">
                <circle cx="20" cy="18" r="6" fill="#22c55e" />
                <circle cx="35" cy="16" r="8" fill="#16a34a" />
                <circle cx="50" cy="19" r="5" fill="#15803d" />
                <circle cx="65" cy="14" r="9" fill="#168447" />
              </g>
            </svg>
          </div>
        </div>

        {/* Create New Plan Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-xl border border-border">
              <div className="flex items-center justify-between pb-3 border-b">
                <h3 className="font-bold text-sm text-foreground">
                  Create New Farming Plan
                </h3>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-lg p-1 hover:bg-muted cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                    Crop Name
                  </label>
                  <input
                    type="text"
                    value={newCropName}
                    onChange={(e) => setNewCropName(e.target.value)}
                    placeholder="e.g. Mustard, Cotton, Maize"
                    className="w-full rounded-xl border p-2 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                    Variety
                  </label>
                  <input
                    type="text"
                    value={newVariety}
                    onChange={(e) => setNewVariety(e.target.value)}
                    placeholder="e.g. Pusa Bold, Hybrid 900"
                    className="w-full rounded-xl border p-2 text-xs outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                      Area (acres)
                    </label>
                    <input
                      type="text"
                      value={newArea}
                      onChange={(e) => setNewArea(e.target.value)}
                      placeholder="e.g. 2.50"
                      className="w-full rounded-xl border p-2 text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                      Expected Yield
                    </label>
                    <input
                      type="text"
                      value={newYield}
                      onChange={(e) => setNewYield(e.target.value)}
                      placeholder="e.g. 25"
                      className="w-full rounded-xl border p-2 text-xs outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-xl border px-3 py-1.5 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreatePlan}
                  className="rounded-xl bg-[#168447] px-4 py-1.5 text-xs font-bold text-white"
                >
                  Save Plan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Task Details Modal */}
        {selectedTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm rounded-2xl bg-card p-5 shadow-xl border border-border">
              <div className="flex items-center justify-between pb-3 border-b">
                <h3 className="font-bold text-sm text-foreground">
                  Task Details
                </h3>
                <button
                  type="button"
                  onClick={() => setSelectedTask(null)}
                  className="rounded-lg p-1 hover:bg-muted cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 space-y-2 text-xs">
                <div>
                  <span className="text-muted-foreground">Task:</span>
                  <p className="font-bold text-foreground">
                    {selectedTask.name}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Field:</span>
                  <p className="font-bold text-foreground">
                    {selectedTask.field}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Scheduled Date:</span>
                  <p className="font-bold text-foreground">
                    {selectedTask.date}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <p className="font-bold text-[#168447]">
                    {selectedTask.status}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedTask(null)}
                  className="rounded-xl border px-3 py-1.5 text-xs font-semibold"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleToggleTask(selectedTask.id);
                    setSelectedTask(null);
                  }}
                  className="rounded-xl bg-[#168447] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#14743e] transition-colors cursor-pointer"
                >
                  {selectedTask.status === "Completed" ? "Mark as Upcoming" : "Mark as Completed"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
