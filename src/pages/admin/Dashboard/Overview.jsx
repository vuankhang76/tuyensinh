import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Building2,
  BookOpen,
  Users,
  FileText,
  AlertCircle
} from 'lucide-react';
import { universityService } from '@/services/universityService';
import { userService } from '@/services/userService';
import { majorService } from '@/services/majorService';
import { admissionNewsService } from '@/services/admissionNewsService';

const Overview = () => {
  const [stats, setStats] = useState({
    universities: 0,
    majors: 0,
    users: 0,
    publishedNews: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const [universitiesData, usersData, majorsData, newsData] = await Promise.allSettled([
        universityService.getAllUniversities(),
        userService.getAllUsers(),
        majorService.getAllMajors(),
        admissionNewsService.getAllAdmissionNews()
      ]);

      const newStats = {
        universities: universitiesData.status === 'fulfilled' ? universitiesData.value?.length || 0 : 0,
        users: usersData.status === 'fulfilled' ? usersData.value?.length || 0 : 0,
        majors: majorsData.status === 'fulfilled' ? majorsData.value?.length || 0 : 0,
        publishedNews: newsData.status === 'fulfilled' ? newsData.value?.length || 0 : 0
      };

      setStats(newStats);

      const failedRequests = [universitiesData, usersData, majorsData, newsData]
        .filter(result => result.status === 'rejected');

    } catch (error) {
      setError('Không thể tải dữ liệu thống kê. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

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

  if (error) {
    return (
      <div>
        <h2 className="mb-6 text-2xl font-bold">Tổng quan hệ thống</h2>
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
            <button 
              onClick={fetchStats}
              className="ml-2 underline text-blue-600 hover:text-blue-800"
            >
              Thử lại
            </button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Tổng quan hệ thống</h2>
        <button
          onClick={fetchStats}
          disabled={loading}
          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Đang tải...' : 'Làm mới'}
        </button>
      </div>

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
                      {loading ? (
                        <span className="inline-block w-8 h-8 bg-gray-200 rounded animate-pulse"></span>
                      ) : (
                        stat.value.toLocaleString('vi-VN')
                      )}
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
      
      <div className="mt-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Hoạt động gần đây</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                {loading ? (
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                  </div>
                ) : (
                  "Chưa có dữ liệu hoạt động để hiển thị."
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Thống kê truy cập</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                {loading ? (
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3"></div>
                  </div>
                ) : (
                  "Biểu đồ thống kê sẽ được hiển thị ở đây."
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Overview; 