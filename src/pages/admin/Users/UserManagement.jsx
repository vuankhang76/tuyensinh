import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import {
  Plus,
  Edit,
  Trash2,
  Shield,
  CheckCircle,
  XCircle
} from 'lucide-react';

const UserManagement = () => {
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Sample data - in real app, this would come from API
  const [users, setUsers] = useState([
    {
      id: 1,
      email: 'student@gmail.com',
      name: 'Nguyễn Văn A',
      role: 'student',
      status: 'active',
      createdAt: '2024-01-01',
      lastLogin: '2024-01-15',
      verified: true
    },
    {
      id: 2,
      email: 'admin@hust.edu.vn',
      name: 'Admin HUST',
      role: 'university',
      status: 'active',
      createdAt: '2024-01-05',
      lastLogin: '2024-01-14',
      verified: true
    },
    {
      id: 3,
      email: 'admin@system.com',
      name: 'System Administrator',
      role: 'admin',
      status: 'active',
      createdAt: '2024-01-01',
      lastLogin: '2024-01-15',
      verified: true
    },
    {
      id: 4,
      email: 'newuser@example.com',
      name: 'Người dùng mới',
      role: 'student',
      status: 'pending',
      createdAt: '2024-01-10',
      lastLogin: null,
      verified: false
    }
  ]);

  const getRoleBadge = (role) => {
    const variants = {
      admin: 'destructive',
      university: 'default',
      student: 'secondary'
    };
    const labels = {
      admin: 'Quản trị',
      university: 'Trường ĐH',
      student: 'Sinh viên'
    };
    return { variant: variants[role], label: labels[role] };
  };

  const getStatusBadge = (status) => {
    const variants = {
      active: 'secondary',
      pending: 'outline',
      inactive: 'destructive'
    };
    const labels = {
      active: 'Hoạt động',
      pending: 'Chờ duyệt',
      inactive: 'Tạm khóa'
    };
    return { variant: variants[status], label: labels[status] };
  };

  const handleEdit = (record) => {
    // TODO: Open edit modal
    toast({
      title: "Thông báo",
      description: "Chức năng sửa thông tin người dùng",
    });
  };

  const handleVerify = (id) => {
    setUsers(users.map(u => 
      u.id === id ? { ...u, verified: true, status: 'active' } : u
    ));
    toast({
      title: "Thành công",
      description: "Đã xác minh người dùng thành công",
    });
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (userToDelete) {
      setUsers(users.filter(u => u.id !== userToDelete.id));
      toast({
        title: "Thành công",
        description: "Đã xóa người dùng thành công",
      });
    }
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const handleAdd = () => {
    // TODO: Open add user modal
    toast({
      title: "Thông báo",
      description: "Chức năng thêm người dùng mới",
    });
  };

  // Filter functions
  const pendingUsers = users.filter(u => u.status === 'pending');
  const unverifiedUsers = users.filter(u => !u.verified);

  const sortedUsers = [...users].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Quản lý Người dùng</h2>
          <div className="flex space-x-4 mt-2 text-sm text-gray-600">
            <span>Tổng: {users.length}</span>
            <span>Chờ duyệt: {pendingUsers.length}</span>
            <span>Chưa xác minh: {unverifiedUsers.length}</span>
          </div>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm người dùng
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="w-32">Vai trò</TableHead>
              <TableHead className="w-32">Trạng thái</TableHead>
              <TableHead className="w-24 text-center">Xác minh</TableHead>
              <TableHead className="w-32">Ngày tạo</TableHead>
              <TableHead className="w-36">Đăng nhập cuối</TableHead>
              <TableHead className="w-48">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedUsers.map((user) => {
              const roleBadge = getRoleBadge(user.role);
              const statusBadge = getStatusBadge(user.status);
              
              return (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={roleBadge.variant}>
                      {roleBadge.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusBadge.variant}>
                      {statusBadge.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {user.verified ? (
                      <CheckCircle className="h-4 w-4 text-green-600 mx-auto" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600 mx-auto" />
                    )}
                  </TableCell>
                  <TableCell>{user.createdAt}</TableCell>
                  <TableCell>{user.lastLogin || 'Chưa đăng nhập'}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(user)}
                        title="Sửa"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVerify(user.id)}
                        disabled={user.verified}
                        title="Xác minh"
                      >
                        <Shield className="h-4 w-4" />
                      </Button>
                      
                      {user.role !== 'admin' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(user)}
                          className="text-red-600 hover:text-red-700"
                          title="Xóa"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination could be added here */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          Hiển thị 1-{users.length} của {users.length} người dùng
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa người dùng</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa người dùng "{userToDelete?.name}"? 
              Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteConfirm}
            >
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement; 