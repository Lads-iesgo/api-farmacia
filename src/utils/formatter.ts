export class FormatterUtils {
  static formatCPF(cpf: string): string {
    const clean = cpf.replace(/\D/g, '');
    return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  static formatCEP(cep: string): string {
    const clean = cep.replace(/\D/g, '');
    return clean.replace(/(\d{5})(\d{3})/, '$1-$2');
  }

  static formatPhone(phone: string): string {
    const clean = phone.replace(/\D/g, '');

    if (clean.length === 11) {
      return clean.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (clean.length === 10) {
      return clean.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }

    return phone;
  }

  static formatDate(date: Date): string {
    return date.toLocaleDateString('pt-BR');
  }

  static formatDateTime(date: Date): string {
    return date.toLocaleString('pt-BR');
  }

  static formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  static sanitizeString(str: string): string {
    return str.trim().replace(/\s+/g, ' ');
  }

  static slugify(str: string): string {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-');
  }
}
