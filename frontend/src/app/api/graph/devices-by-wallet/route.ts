// File: app/api/devices/by-owner/route.ts
import { graphClient } from '@/lib/graph';
import { gql } from '@apollo/client';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const walletAddress = searchParams.get('address');

        if (!walletAddress) {
            return new Response('{"status":"wallet address error"', {
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const DEVICES_BY_OWNER_QUERY = `
      query($id: ID!) {
        devices(where: { id: $id }) {
          id
          deviceMetadata
          ngrokLink
          hostingFee
          createdAt
          updatedAt
          agents {
            id
            subname
            perApiCallFee
            avatar
            characterConfig
            isPublic
          }
          owner {
            id
          }
        }
      }
    `;

        const { data } = await graphClient.query({
            query: gql(DEVICES_BY_OWNER_QUERY),
            variables: {
                id: walletAddress.toLowerCase()
            }
        });

        if (data.devices.length === 0) {
            return new Response('{"status":"no data error"', {
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return NextResponse.json([data.devices[0]], {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0'
            }
        });
    } catch (error) {
        console.error('Error fetching devices by wallet:', error);
        return NextResponse.json(
            { error: 'Failed to fetch devices by wallet' },
            { status: 500 }
        );
    }
}