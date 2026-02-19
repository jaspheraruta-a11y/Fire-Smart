import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Incident } from '../types';

function safeText(value: unknown): string {
    if (value == null) return '';
    return String(value).replace(/\s+/g, ' ').trim();
}

function formatDate(value: unknown): string {
    try {
        if (!value) return '';
        const d = new Date(String(value));
        if (Number.isNaN(d.getTime())) return safeText(value);
        return d.toLocaleString();
    } catch {
        return safeText(value);
    }
}

export function exportIncidentsToCsv(incidents: Incident[], filename = 'incident-reports.csv') {
    const headers = ['Incident ID', 'Timestamp', 'Address', 'Status', 'Assigned Unit'];
    const rows = incidents.map((i) => [
        safeText(i.id),
        formatDate(i.timestamp),
        safeText(i.address),
        safeText(i.status),
        safeText(i.assignedUnit ?? 'N/A'),
    ]);

    const escapeCell = (cell: string) => `"${cell.replace(/"/g, '""')}"`;
    const csv = [headers, ...rows]
        .map((row) => row.map((c) => escapeCell(String(c ?? ''))).join(','))
        .join('\r\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

/**
 * Generates a landscape PDF table with consistent margins and automatic column widths.
 * This avoids misaligned "position" issues on different incident lengths.
 */
export function exportIncidentsToPdf(incidents: Incident[], filename = 'incident-reports.pdf') {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });

    const marginX = 40;
    const titleY = 40;
    doc.setFontSize(16);
    doc.text('Incident Reports & Logs', marginX, titleY);

    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text(`Generated: ${new Date().toLocaleString()}`, marginX, titleY + 18);
    doc.setTextColor(0);

    const head = [['Incident ID', 'Timestamp', 'Address', 'Status', 'Assigned Unit']];
    const body = incidents.map((i) => [
        safeText(i.id),
        formatDate(i.timestamp),
        safeText(i.address),
        safeText(i.status),
        safeText(i.assignedUnit ?? 'N/A'),
    ]);

    autoTable(doc, {
        startY: titleY + 32,
        head,
        body,
        margin: { left: marginX, right: marginX },
        tableWidth: 'auto',
        styles: {
            fontSize: 9,
            cellPadding: 6,
            overflow: 'linebreak',
            valign: 'middle',
        },
        headStyles: {
            fillColor: [42, 42, 42],
            textColor: 255,
            fontStyle: 'bold',
        },
        alternateRowStyles: {
            fillColor: [245, 245, 245],
        },
        columnStyles: {
            0: { cellWidth: 160 }, // ID
            1: { cellWidth: 140 }, // timestamp
            2: { cellWidth: 320 }, // address
            3: { cellWidth: 90 },  // status
            4: { cellWidth: 140 }, // unit
        },
    });

    doc.save(filename);
}

