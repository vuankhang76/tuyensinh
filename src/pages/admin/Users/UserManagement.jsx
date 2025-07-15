import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom'; // Import useSearchParams
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { toast } from 'sonner';
import { userService } from '@/services/userService';
import { useDebounce } from '@/hooks/useDebounce';

import {
  Plus,
  Edit,
  Trash2,
  Shield,
  CheckCircle,
  XCircle,
  Search,
  RefreshCw
} from 'lucide-react';

const UserManagement = () => {
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [userToEdit, setUserToEdit] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [roleFilter, setRoleFilter] = useState(searchParams.get('role') || 'all');

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [editForm, setEditForm] = useState({
    displayName: '',
    email: '',
    role: '',
    status: ''
  });

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await userService.getAllUsers();
      setUsers(response);
    } catch (error) {
      toast.error('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (searchTerm !== debouncedSearchTerm) {
      setSearchLoading(true);
    }
  }, [searchTerm, debouncedSearchTerm]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearchTerm) {
      params.set('q', debouncedSearchTerm);
    }
    if (roleFilter !== 'all') {
      params.set('role', roleFilter);
    }
    if (currentPage > 1) {
      params.set('page', currentPage.toString());
    }
    setSearchParams(params, { replace: true });
  }, [debouncedSearchTerm, roleFilter, currentPage, setSearchParams]);

  // Reset to page 1 when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, roleFilter]);


  useEffect(() => {
    let filtered = users;

    if (debouncedSearchTerm) {
      filtered = filtered.filter(user =>
        user.displayName?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
    setSearchLoading(false);
  }, [users, debouncedSearchTerm, roleFilter]);

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
    return { variant: variants[role] || 'outline', label: labels[role] || 'Không xác định' };
  };

  const handleEditClick = (user) => {
    setUserToEdit(user);
    setEditForm({
      displayName: user.displayName || '',
      email: user.email || '',
      role: user.role || '',
    });
    setEditDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    try {
      await userService.updateUser(userToEdit.id, editForm);
      setUsers(users.map(u =>
        u.id === userToEdit.id ? { ...u, ...editForm } : u
      ));
      toast.success('Cập nhật thông tin người dùng thành công');
      setEditDialogOpen(false);
      setUserToEdit(null);
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Có lỗi xảy ra khi cập nhật');
    }
  };

  const handleVerify = async (user) => {
    try {
      await userService.updateUserByAdmin(user.id);
      setUsers(users.map(u =>
        u.id === user.id ? { ...u, emailVerified: true } : u
      ));
      toast.success('Đã xác minh người dùng thành công');
    } catch (error) {
      console.error('Error verifying user:', error);
      toast.error('Có lỗi xảy ra khi xác minh');
    }
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await userService.deleteUser(userToDelete.id);
      setUsers(users.filter(u => u.id !== userToDelete.id));
      toast.success('Đã xóa người dùng thành công');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Có lỗi xảy ra khi xóa người dùng');
    } finally {
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const handleAdd = () => {
    toast.info("Chức năng thêm người dùng mới sẽ được phát triển");
  };

  const handleRefresh = () => {
    setSearchTerm('');
    setRoleFilter('all');
    setCurrentPage(1);
    setSearchLoading(false);
    fetchUsers();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa rõ';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit'
      });
    } catch (error) {
      return 'Chưa rõ';
    }
  };

  const sortedUsers = [...filteredUsers].sort((a, b) => (a.displayName || '').localeCompare(b.displayName || ''));
  
  const totalResults = sortedUsers.length;
  const totalPages = Math.ceil(totalResults / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedUsers = sortedUsers.slice(startIndex, endIndex);
  
  const startResult = startIndex + 1;
  const endResult = Math.min(endIndex, totalResults);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Quản lý Người dùng</h2>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Làm mới
          </Button>
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm người dùng
          </Button>
        </div>
      </div>

      <div className="flex space-x-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          {searchLoading && (
            <RefreshCw className="absolute right-3 top-3 h-4 w-4 text-gray-400 animate-spin" />
          )}
          <Input
            placeholder="Tìm kiếm theo tên hoặc email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`pl-10 ${searchLoading ? 'pr-10' : ''}`}
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Lọc theo vai trò" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả vai trò</SelectItem>
            <SelectItem value="admin">Quản trị</SelectItem>
            <SelectItem value="university">Trường ĐH</SelectItem>
            <SelectItem value="student">Sinh viên</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">ID</TableHead>
              <TableHead className="w-48">Tên hiển thị</TableHead>
              <TableHead className="w-64">Email</TableHead>
              <TableHead className="w-32">Vai trò</TableHead>
              <TableHead className="w-24 text-center">Xác minh</TableHead>
              <TableHead className="w-40">Ngày tạo</TableHead>
              <TableHead className="w-40">Đăng nhập cuối</TableHead>
              <TableHead className="w-48">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {searchLoading || loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                  <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                  <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                  <TableCell><div className="h-6 bg-gray-200 rounded animate-pulse w-20"></div></TableCell>
                  <TableCell className="text-center"><div className="h-4 w-4 bg-gray-200 rounded-full animate-pulse mx-auto"></div></TableCell>
                  <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                  <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : paginatedUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  {debouncedSearchTerm || roleFilter !== 'all' ? 'Không tìm thấy người dùng nào' : 'Không có người dùng nào'}
                </TableCell>
              </TableRow>
            ) : (
              paginatedUsers.map((user) => {
                const roleBadge = getRoleBadge(user.role);
                return (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium max-w-10">
                      <div className="truncate" title={user.id}>
                        {user.id}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium max-w-48">
                      <div className="truncate" title={user.displayName || 'Chưa cập nhật'}>
                        {user.displayName || 'Chưa cập nhật'}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-64">
                      <div className="truncate" title={user.email}>
                        {user.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={roleBadge.variant}>
                        {roleBadge.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {user.emailVerified ? (
                        <CheckCircle className="h-4 w-4 text-green-600 mx-auto" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600 mx-auto" />
                      )}
                    </TableCell>
                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                    <TableCell>{user.lastLoginAt ? formatDate(user.lastLoginAt) : "Chưa đăng nhập"}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditClick(user)}
                          title="Sửa"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleVerify(user)}
                          disabled={user.emailVerified}
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
              })
            )}
          </TableBody>
        </Table>
      </div>

      {totalResults > 0 && (
        <div className="flex items-center justify-between w-full py-4">
          <div className="flex items-center justify-between w-full">
            <div className="text-sm text-muted-foreground w-100">
              Hiển thị {startResult}-{endResult} trên tổng {totalResults} kết quả
            </div>
            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>

                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          isActive={currentPage === pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className="cursor-pointer"
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}  
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
            <div className="flex items-center gap-2 w-100">
              <span className="text-sm text-muted-foreground">Hiển thị:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2 py-1 border rounded text-sm"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span className="text-sm text-muted-foreground">mục/trang</span>
            </div>
          </div>
        </div>
      )}

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sửa thông tin người dùng</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin người dùng "{userToEdit?.displayName}"
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="displayName" className='mb-2'>Tên hiển thị</Label>
              <Input
                id="displayName"
                value={editForm.displayName}
                onChange={(e) => setEditForm({ ...editForm, displayName: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="email" className='mb-2'>Email</Label>
              <Input
                id="email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="role" className='mb-2'>Vai trò</Label>
              <Select value={editForm.role} onValueChange={(value) => setEditForm({ ...editForm, role: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn vai trò" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Sinh viên</SelectItem>
                  <SelectItem value="university">Trường ĐH</SelectItem>
                  <SelectItem value="admin">Quản trị</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button onClick={handleEditSubmit}>
              Cập nhật
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa người dùng</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa người dùng "{userToDelete?.displayName}"?
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