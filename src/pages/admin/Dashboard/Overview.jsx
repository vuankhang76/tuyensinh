import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Building2,
  BookOpen,
  Users,
  FileText
} from 'lucide-react';

const Overview = () => {
  // Mock data - in real app, this would come from API
  const stats = {
    universities: 15,
    majors: 45,
    users: 128,
    publishedNews: 12
  };

  const statCards = [
    {
      title: "Tổng số trường ĐH",
      value: stats.universities,
      icon: Building2,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Tổng số ngành học",
      value: stats.majors,
      icon: BookOpen,
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      title: "Tổng số người dùng",
      value: stats.users,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Tin tức đã xuất bản",
      value: stats.publishedNews,
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold">Tổng quan hệ thống</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`rounded-full p-3 ${stat.bgColor}`}>
                    <IconComponent className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {/* Additional dashboard content can go here */}
      <div className="mt-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Hoạt động gần đây</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Chưa có dữ liệu hoạt động để hiển thị.
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Thống kê truy cập</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Biểu đồ thống kê sẽ được hiển thị ở đây.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Overview; 