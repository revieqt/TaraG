import React, { useMemo, useState, useCallback } from "react";
import { View, Text, TouchableOpacity, LayoutChangeEvent } from "react-native";

type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color?: string;
};

type WeeklyCalendarProps = {
  startOfWeek?: "sunday" | "monday";
  events?: CalendarEvent[];
  onDayPress?: (date: Date) => void;
};

const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({
  startOfWeek = "monday",
  events = [],
  onDayPress,
}) => {
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());
  const [containerWidth, setContainerWidth] = useState<number>(0);

  // Today reference
  const today = new Date();

  // Handle layout change to capture container width
  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  }, []);

  // Calculate start of week
  const currentWeekStart = useMemo(() => {
    const day = today.getDay();
    const diff =
      startOfWeek === "monday"
        ? (day === 0 ? -6 : 1 - day)
        : -day;
    const d = new Date(today);
    d.setDate(today.getDate() + diff);
    return d;
  }, [startOfWeek, today]);

  // Generate 7 days
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(currentWeekStart);
    d.setDate(currentWeekStart.getDate() + i);
    return d;
  });

  // Events that span this day
  const getEventsForDay = (day: Date) => {
    return events.filter((ev) => ev.start <= day && ev.end >= day);
  };

  // Compute day width based on container width
  const dayWidth = containerWidth > 0 ? containerWidth / 7 - 4 : 0; // minus margin

  return (
    <View
      style={{ flexDirection: "row", justifyContent: "space-between" }}
      onLayout={handleLayout}
    >
      {days.map((date, idx) => {
        const isToday = date.toDateString() === today.toDateString();
        const isSelected = date.toDateString() === selectedDay.toDateString();
        const dayEvents = getEventsForDay(date);

        return (
          <TouchableOpacity
            key={idx}
            onPress={() => {
              setSelectedDay(date);
              onDayPress?.(date);
            }}
            style={{
              width: dayWidth,
              marginHorizontal: 2,
              alignItems: "center",
            }}
          >
            {/* Day Box */}
            <View
              style={{
                borderRadius: 10,
                paddingVertical: 8,
                width: "100%",
                backgroundColor: isSelected
                  ? "#007AFF"
                  : isToday
                  ? "#E3F2FD"
                  : "#F5F5F5",
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: 12,
                  color: isSelected ? "#fff" : "#333",
                }}
              >
                {date.toLocaleDateString("en-US", { weekday: "short" })}
              </Text>
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 16,
                  fontWeight: "600",
                  color: isSelected ? "#fff" : "#333",
                }}
              >
                {date.getDate()}
              </Text>
            </View>

            {/* Events indicator */}
            <View style={{ marginTop: 4, width: "100%" }}>
              {dayEvents.map((ev) => {
                const isStart = ev.start.toDateString() === date.toDateString();
                const isEnd = ev.end.toDateString() === date.toDateString();

                return (
                  <View
                    key={ev.id}
                    style={{
                      height: 6,
                      borderRadius: 3,
                      marginVertical: 1,
                      backgroundColor: ev.color || "#4CAF50",
                      opacity: 0.9,
                      width:
                        isStart && isEnd
                          ? "100%"
                          : isStart
                          ? "95%"
                          : isEnd
                          ? "95%"
                          : "100%",
                      alignSelf:
                        isStart
                          ? "flex-start"
                          : isEnd
                          ? "flex-end"
                          : "center",
                    }}
                  />
                );
              })}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default WeeklyCalendar;
