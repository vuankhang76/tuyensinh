import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import {
  Plus,
  Edit,
  Building2,
} from 'lucide-react';
import UniversityModal from './UniversityModal';

const UniversityManagement = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  // Sample data - in real app, this would come from API
  const [universities, setUniversities] = useState([
    {
      id: 1,
      name: 'Đại học Bách Khoa Hà Nội',
      code: 'HUST',
      address: 'Hà Nội',
      phone: '024-3868-3008',
      email: 'info@hust.edu.vn',
      website: 'https://hust.edu.vn',
      status: 'active',
      logo: 'https://example.com/logo1.png',
      description: 'Trường đại học hàng đầu về kỹ thuật và công nghệ',
      established: '1956',
      type: 'Công lập'
    },
    {
      id: 2,
      name: 'Đại học Quốc gia Hà Nội',
      code: 'VNU',
      address: 'Hà Nội',
      phone: '024-3754-7506',
      email: 'info@vnu.edu.vn',
      website: 'https://vnu.edu.vn',
      status: 'active',
      logo: 'https://example.com/logo2.png',
      description: 'Đại học quốc gia đa ngành',
      established: '1906',
      type: 'Công lập'
    },
    {
      id: 3,
      name: 'Đại học FPT',
      code: 'FPT',
      address: 'Hà Nội',
      phone: '024-7300-1866',
      email: 'info@fpt.edu.vn',
      website: 'https://fpt.edu.vn',
      status: 'active',
      logo: 'https://example.com/logo3.png',
      description: 'Trường đại học tư thục chuyên về công nghệ',
      established: '2006',
      type: 'Tư thục'
    }
  ]);

  const handleView = (record) => {
    navigate(`/admin/universities/${record.id}`);
  };

  const handleAdd = () => {
    setEditingRecord(null);
    setIsModalVisible(true);
  };

  const handleSubmit = (values) => {
    if (editingRecord) {
      // Update existing university
      setUniversities(universities.map(u => 
        u.id === editingRecord.id ? { ...u, ...values } : u
      ));
      toast.success("Đã cập nhật thông tin trường đại học");
    } else {
      // Add new university
      const newUniversity = { 
        ...values, 
        id: Date.now(),
        status: values.status || 'active'
      };
      setUniversities([...universities, newUniversity]);
      toast.success("Đã thêm trường đại học mới");
    }
    setIsModalVisible(false);
    setEditingRecord(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Quản lý Trường Đại học</h2>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm trường mới
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10 font-bold">Id</TableHead>
              <TableHead className="w-50 font-bold">Tên trường</TableHead>
              <TableHead className="w-24 font-bold">Mã trường</TableHead>
              <TableHead className="w-24 font-bold">Địa chỉ</TableHead>
              <TableHead className="w-24 font-bold">Loại hình</TableHead>
              <TableHead className="w-20 font-bold">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {universities.map((university) => (
              <TableRow 
                key={university.id}
                className="hover:bg-muted/50 transition-colors"
              >
                <TableCell>{university.id}</TableCell>
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={university.logo} alt={university.name} />
                      <AvatarFallback>
                        <Building2 className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{university.name}</div>
                      <div className="text-sm text-muted-foreground truncate max-w-xs">
                        {university.description}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{university.code}</Badge>
                </TableCell>
                <TableCell className="max-w-xs truncate">{university.address}</TableCell>
                <TableCell>
                  <span>
                    {university.type}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="cursor-pointer hover:bg-primary/10 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleView(university);
                      }}
                      title="Chỉnh sửa"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination placeholder */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          Hiển thị 1-{universities.length} của {universities.length} trường
        </div>
      </div>

      <UniversityModal
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingRecord(null);
        }}
        onSubmit={handleSubmit}
        editingRecord={editingRecord}
      />
    </div>
  );
};

export default UniversityManagement; 