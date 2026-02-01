import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Building2, ArrowRight, Shield, Zap, Globe } from 'lucide-react';

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
              <Building2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl text-foreground">NovaBank</span>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link to="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button className="btn-gradient">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
              <Zap className="h-4 w-4" />
              Modern Banking for the Digital Age
            </div>
            <h1 className="text-5xl lg:text-7xl font-display font-bold leading-tight mb-6">
              Banking Made
              <span className="block bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Simple & Secure
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Experience the future of banking with NovaBank. Fast transfers, secure accounts, 
              and powerful tools to manage your finances with confidence.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <Button size="lg" className="btn-gradient h-14 px-8 text-lg">
                  Open Free Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-display font-bold mb-4">
              Why Choose NovaBank?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Built with the latest technology to give you the best banking experience
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-display font-semibold mb-3">Bank-Grade Security</h3>
              <p className="text-muted-foreground">
                Your money and data are protected with enterprise-level security and encryption
              </p>
            </div>
            <div className="text-center p-8">
              <div className="h-16 w-16 rounded-2xl bg-success/10 flex items-center justify-center mx-auto mb-6">
                <Zap className="h-8 w-8 text-success" />
              </div>
              <h3 className="text-xl font-display font-semibold mb-3">Instant Transfers</h3>
              <p className="text-muted-foreground">
                Send and receive money instantly. No waiting, no delays
              </p>
            </div>
            <div className="text-center p-8">
              <div className="h-16 w-16 rounded-2xl bg-warning/10 flex items-center justify-center mx-auto mb-6">
                <Globe className="h-8 w-8 text-warning" />
              </div>
              <h3 className="text-xl font-display font-semibold mb-3">Access Anywhere</h3>
              <p className="text-muted-foreground">
                Manage your accounts from any device, anywhere in the world
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-primary rounded-3xl p-12 lg:p-16 text-center text-primary-foreground">
            <h2 className="text-3xl lg:text-4xl font-display font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-primary-foreground/80 text-lg max-w-xl mx-auto mb-8">
              Join thousands of users who trust NovaBank for their financial needs
            </p>
            <Link to="/register">
              <Button size="lg" variant="secondary" className="h-14 px-8 text-lg font-semibold">
                Create Free Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Building2 className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-display font-bold">NovaBank</span>
            </div>
            <p className="text-muted-foreground text-sm">
              © 2025 NovaBank. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
