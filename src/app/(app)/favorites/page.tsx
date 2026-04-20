'use client'

import React from 'react'
import { Star, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/empty-state'
import { useApp } from '@/providers/AppProvider'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function FavoritesPage() {
  const { language, favorites, toggleFavorite } = useApp()
  const { status } = useSession()

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="px-6 py-5 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-xs">Personal Collection</Badge>
              </div>
              <h1 className="text-xl font-semibold">My Favorites</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Your saved pharmaceutical products
              </p>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-lg font-medium">{favorites.length}</div>
                <div className="text-xs text-muted-foreground">Saved</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 max-w-7xl mx-auto">
        {status === 'unauthenticated' ? (
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <Star className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Sign in to view favorites</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Save your frequently used medications for quick access
            </p>
          </div>
        ) : favorites.length === 0 ? (
          <EmptyState
            variant="favorites"
            title="No favorites yet"
            description="Save your frequently used medications for quick access."
            action={{
              label: "Browse Drugs",
              onClick: () => window.location.href = '/search'
            }}
          />
        ) : (
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Saved Drugs</span>
                <Badge variant="secondary" className="text-xs">{favorites.length}</Badge>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Drug Code</th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Drug Name</th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Generic</th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Notes</th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {favorites.map((fav: any) => (
                    <tr key={fav.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-mono">{fav.drugCode}</td>
                      <td className="px-6 py-4 text-sm font-medium">{fav.drugName}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">-</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{fav.notes || '-'}</td>
                      <td className="px-6 py-4">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => toggleFavorite(fav.drugCode)}
                          className="h-8 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}