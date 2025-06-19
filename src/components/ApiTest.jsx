import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import universityService from '../services/universityService'

const ApiTest = () => {
  const [universities, setUniversities] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [testResult, setTestResult] = useState('')

  const testGetAllUniversities = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await universityService.getAllUniversities()
      setUniversities(data)
      setTestResult(`✅ Thành công! Lấy được ${data.length} trường đại học`)
    } catch (err) {
      setError(err.message)
      setTestResult('❌ Thất bại!')
    } finally {
      setLoading(false)
    }
  }

  const testCreateUniversity = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const newUniversity = {
        name: 'Test University',
        shortName: 'TEST',
        introduction: 'This is a test university',
        officialWebsite: 'https://test.edu.vn',
        admissionWebsite: 'https://test.edu.vn/tuyen-sinh',
        ranking: 100,
        rankingCriteria: 'Test ranking',
        locations: 'Hà Nội',
        type: 'Công lập'
      }
      
      const created = await universityService.createUniversity(newUniversity)
      setTestResult(`✅ Tạo trường thành công! ID: ${created.id}`)
      
      // Refresh list
      testGetAllUniversities()
    } catch (err) {
      setError(err.message)
      setTestResult('❌ Tạo trường thất bại!')
    } finally {
      setLoading(false)
    }
  }

  const testSearchUniversities = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const results = await universityService.searchUniversities('Đại học', { type: 'Công lập' })
      setTestResult(`✅ Tìm kiếm thành công! Tìm được ${results.length} kết quả`)
    } catch (err) {
      setError(err.message)
      setTestResult('❌ Tìm kiếm thất bại!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">API Test - University Service</h2>
      
      <div className="grid gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Test API Endpoints</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 flex-wrap">
              <Button 
                onClick={testGetAllUniversities}
                disabled={loading}
              >
                Test Get All Universities
              </Button>
              <Button 
                onClick={testCreateUniversity}
                disabled={loading}
                variant="outline"
              >
                Test Create University
              </Button>
              <Button 
                onClick={testSearchUniversities}
                disabled={loading}
                variant="outline"
              >
                Test Search Universities
              </Button>
            </div>
            
            {loading && (
              <div className="mt-4 text-blue-600">Đang thực hiện test...</div>
            )}
            
            {testResult && (
              <Alert className="mt-4">
                <AlertDescription>{testResult}</AlertDescription>
              </Alert>
            )}
            
            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>Lỗi: {error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Kết quả API ({universities.length} trường)</CardTitle>
          </CardHeader>
          <CardContent>
            {universities.length > 0 ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {universities.slice(0, 10).map((uni) => (
                  <div key={uni.id} className="p-3 border rounded">
                    <div className="font-medium">{uni.name}</div>
                    <div className="text-sm text-gray-600">
                      {uni.shortName} • {uni.type} • Ranking: {uni.ranking || 'N/A'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {uni.locations} • {uni.officialWebsite}
                    </div>
                  </div>
                ))}
                {universities.length > 10 && (
                  <div className="text-center text-gray-500">
                    ... và {universities.length - 10} trường khác
                  </div>
                )}
              </div>
            ) : (
              <div className="text-gray-500">Chưa có dữ liệu</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ApiTest 