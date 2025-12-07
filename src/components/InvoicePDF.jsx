import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Register fonts? Using standard Helvetica for now to avoid async font loading complexity in this context,
// but could register fonts if needed.
// Ideally, we'd register Inter if we had the ttf file.

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#334155',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  invoiceTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#e2e8f0', // Light gray invoice text
    textTransform: 'uppercase',
  },
  companyInfo: {
    marginBottom: 20,
    fontSize: 10,
    lineHeight: 1.5,
  },
  billTo: {
    marginTop: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#94a3b8',
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  table: {
    marginTop: 20,
    flexDirection: 'column',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 5,
    marginBottom: 5,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  colDesc: { width: '50%' },
  colQty: { width: '15%', textAlign: 'right' },
  colRate: { width: '15%', textAlign: 'right' },
  colTotal: { width: '20%', textAlign: 'right' },
  
  colHeaderStr: {
      color: '#64748b',
      fontWeight: 'bold',
  },
  
  totalsSection: {
    marginTop: 20,
    alignItems: 'flex-end',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 5,
    width: '50%',
  },
  totalLabel: {
    width: '40%',
    textAlign: 'right',
    marginRight: 10,
    color: '#64748b',
  },
  totalValue: {
    width: '40%',
    textAlign: 'right',
    fontWeight: 'bold',
  },
  grandTotal: {
    fontSize: 14,
    color: '#2563eb',
    marginTop: 5,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 5,
  },
  footer: {
      marginTop: 40,
      borderTopWidth: 1,
      borderTopColor: '#e2e8f0',
      paddingTop: 20,
      textAlign: 'center',
      color: '#94a3b8',
      fontSize: 8,
  }
});

const InvoicePDF = ({ invoice, company }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
             <Text style={styles.logoText}>{company.name}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text>#{invoice.invoiceNumber}</Text>
            <Text>Date: {invoice.date}</Text>
            <Text>Due: {invoice.dueDate}</Text>
        </View>
      </View>

      {/* From / To */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={styles.companyInfo}>
            <Text style={styles.sectionTitle}>From</Text>
            <Text style={{ fontWeight: 'bold' }}>{company.name}</Text>
            <Text>{company.email}</Text>
            <Text>{company.address}</Text>
          </View>

          <View style={styles.billTo}>
            <Text style={styles.sectionTitle}>Bill To</Text>
            <Text style={{ fontWeight: 'bold' }}>{invoice.clientName}</Text>
            <Text>{invoice.clientEmail}</Text>
            <Text>{invoice.clientAddress}</Text>
          </View>
      </View>

      {/* Line Items */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
            <Text style={[styles.colDesc, styles.colHeaderStr]}>Item Description</Text>
            <Text style={[styles.colQty, styles.colHeaderStr]}>Qty</Text>
            <Text style={[styles.colRate, styles.colHeaderStr]}>Rate</Text>
            <Text style={[styles.colTotal, styles.colHeaderStr]}>Amount</Text>
        </View>
        
        {invoice.items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
                <Text style={styles.colDesc}>{item.description}</Text>
                <Text style={styles.colQty}>{item.quantity}</Text>
                <Text style={styles.colRate}>{`Rs. ${Number(item.rate).toFixed(2)}`}</Text>
                <Text style={styles.colTotal}>{`Rs. ${(Number(item.quantity) * Number(item.rate)).toFixed(2)}`}</Text>
            </View>
        ))}
      </View>

      {/* Totals */}
      <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalValue}>{`Rs. ${invoice.subtotal.toFixed(2)}`}</Text>
          </View>
          <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tax ({invoice.taxRate}%)</Text>
              <Text style={styles.totalValue}>{`Rs. ${invoice.taxAmount.toFixed(2)}`}</Text>
          </View>
          <View style={[styles.totalRow, styles.grandTotal]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{`Rs. ${invoice.total.toFixed(2)}`}</Text>
          </View>
      </View>
      
      {/* Notes */}
      {invoice.notes && (
          <View style={{ marginTop: 40 }}>
              <Text style={styles.sectionTitle}>Notes</Text>
              <Text>{invoice.notes}</Text>
          </View>
      )}

      {/* Footer */}
      <View style={styles.footer}>
          <Text>Thank you for your business!</Text>
          <Text>{company.name} | {company.website || 'www.dfcreatives.com'}</Text>
      </View>

    </Page>
  </Document>
);

export default InvoicePDF;
